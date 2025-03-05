import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import * as dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import * as duration from 'dayjs/plugin/duration';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { SessionScheduleRepository } from './session-schedule.repository';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';
import {
  SessionSchedule,
  SessionScheduleType,
} from './entities/session-schedule.entity';
import { SessionInstanceService } from '../session-instance/session-instance.service';
import { UpdateSessionInstanceDto } from '../session-instance/dto/update-session-instance.dto';
import { DateUtil } from '../../shared/common/utils/date/date.util';
import { SessionInstance } from '../session-instance/entities/session-instance.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { UserRole } from '../../shared/helpers/roles.enum';

dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(duration);

@Injectable()
export class SessionScheduleService {
  private readonly logger = new Logger(SessionScheduleService.name);

  constructor(
    private readonly sessionScheduleRepository: SessionScheduleRepository,
    private readonly sessionInstanceService: SessionInstanceService,
    private readonly attendanceService: AttendanceService,
    private readonly dateUtil: DateUtil,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createSessionSchedule(
    createSessionScheduleDto: CreateSessionScheduleDto,
  ): Promise<SessionSchedule> {
    this.cleanScheduleFields(createSessionScheduleDto);

    const sessionSchedule = await this.sessionScheduleRepository.create(
      createSessionScheduleDto,
    );

    if (!sessionSchedule) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    if (sessionSchedule.type === SessionScheduleType.ONCE) {
      await this.sessionInstanceService.createSessionInstanceFromSchedule(
        sessionSchedule,
        sessionSchedule.onceDate,
        sessionSchedule.session?.clubId,
      );
    }

    await this.generateSessionInstances(sessionSchedule);

    return sessionSchedule;
  }

  async generateSessionInstances(
    sessionSchedule: SessionSchedule,
  ): Promise<SessionInstance[]> {
    const time = sessionSchedule.time;
    const duration = dayjs.duration({
      hours: parseInt(time.split(':')[0], 10),
      minutes: parseInt(time.split(':')[1], 10),
      seconds: parseInt(time.split(':')[2], 10),
    });
    const start = dayjs.utc(sessionSchedule.startDate).add(duration);
    const end = dayjs.utc(sessionSchedule.endDate).add(duration);
    const daysOfWeek: number[] = [];
    for (let i = 0; i < 7; i++) {
      if (sessionSchedule.dayOfWeekMask[i] === '1') {
        daysOfWeek.push(i + 1);
      }
    }

    const results: Date[] = [];
    for (
      let current = start;
      current.isBefore(end);
      current = current.add(1, 'day')
    ) {
      if (daysOfWeek.includes(current.day())) {
        results.push(current.toDate());
      }
    }

    const sessionInstances = results.map((datetime) => ({
      datetime: datetime,
      durationMinutes: sessionSchedule.durationMinutes,
      sessionScheduleId: sessionSchedule.id,
      isCanceled: false,
    }));

    return this.sessionInstanceService.createSessionInstances(sessionInstances);
  }

  async getTodaySchedules(currentDate: Date): Promise<SessionSchedule[]> {
    return await this.sessionScheduleRepository.findActiveSchedules(
      currentDate,
    );
  }

  async getSessionSchedules(clubId: UUID): Promise<SessionSchedule[]> {
    const sessionSchedules = await this.sessionScheduleRepository.findAll(clubId);

    if (!sessionSchedules) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionSchedules;
  }

  async getSessionSchedulesBySession(
    sessionId: UUID,
  ): Promise<SessionSchedule[]> {
    const sessionSchedules =
      await this.sessionScheduleRepository.findAllBySession(sessionId);

    if (!sessionSchedules) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionSchedules;
  }

  async getSessionSchedulesByUsers(
    userIds: UUID[],
    role: UserRole,
  ): Promise<SessionSchedule[]> {
    const sessionSchedules =
      await this.sessionScheduleRepository.findAllByUsers(userIds, role);

    if (!sessionSchedules) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionSchedules;
  }

  async getSessionSchedule(id: UUID): Promise<SessionSchedule> {
    const sessionSchedule = await this.sessionScheduleRepository.findOne(id);

    if (!sessionSchedule) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionSchedule;
  }

  async updateSessionSchedule(
    id: UUID,
    updateSessionScheduleDto: UpdateSessionScheduleDto,
  ): Promise<SessionSchedule> {
    const sessionSchedule = await this.validateScheduleExists(id);
    this.cleanScheduleFields(updateSessionScheduleDto);

    const updated = await this.sessionScheduleRepository.update(
      id,
      updateSessionScheduleDto,
    );
    if (!updated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    if (updateSessionScheduleDto.type === SessionScheduleType.ONCE) {
      await this.updateSessionInstanceForOnceSession(
        id,
        updateSessionScheduleDto,
      );
    } else {
      await this.sessionInstanceService.removeSessionInstancesBySchedules([id]);
    }

    return this.getSessionSchedule(sessionSchedule.id);
  }

  private async updateSessionInstanceForOnceSession(
    scheduleId: UUID,
    updateSessionScheduleDto: UpdateSessionScheduleDto,
  ): Promise<void> {
    const sessionInstance =
      await this.sessionInstanceService.getInstanceByScheduleId(scheduleId);
    if (!sessionInstance) {
      this.logger.warn(
        `No session instances found for schedule ID: ${scheduleId}`,
      );
      return;
    }

    const sessionTime = await this.dateUtil.combineDateAndTime(
      updateSessionScheduleDto.onceDate,
      updateSessionScheduleDto.time,
    );

    const updateSessionInstanceDto: UpdateSessionInstanceDto = {
      datetime: sessionTime,
      durationMinutes: updateSessionScheduleDto.durationMinutes,
      isCanceled: false,
      sessionScheduleId: scheduleId,
    };

    await this.sessionInstanceService.updateSessionInstance(
      sessionInstance.id,
      updateSessionInstanceDto,
    );
  }

  private cleanScheduleFields(
    scheduleDto: CreateSessionScheduleDto | UpdateSessionScheduleDto,
  ): void {
    if (scheduleDto.type === SessionScheduleType.ONCE) {
      scheduleDto.startDate = null;
      scheduleDto.endDate = null;
      scheduleDto.dayOfWeekMask = null;
    } else {
      scheduleDto.onceDate = null;

      if (!scheduleDto.startDate || !scheduleDto.endDate) {
        throw new BadRequestException(
          'Start date and End date are required for WEEKLY sessions',
        );
      }
    }
  }

  private async validateScheduleExists(id: UUID): Promise<SessionSchedule> {
    const sessionSchedule = await this.getSessionSchedule(id);
    if (!sessionSchedule) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }
    return sessionSchedule;
  }

  async removeSessionSchedule(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const sessionInstances =
        await this.sessionInstanceService.getSessionInstancesBySchedule(id);

      const sessionInstanceIds = sessionInstances.map(
        (instance) => instance.id,
      );

      const attendances =
        await this.attendanceService.getAttendancesBySchedule(id);

      const deletedAttendances =
        attendances?.length > 0
          ? await this.attendanceService.removeAttendancesByInstances(
              sessionInstanceIds,
              transaction,
            )
          : false;

      const deletedSessionInstances =
        sessionInstanceIds.length > 0
          ? await this.sessionInstanceService.removeSessionInstancesBySchedules(
              [id],
              transaction,
            )
          : false;

      const deletedSchedule = await this.sessionScheduleRepository.remove(
        id,
        transaction,
      );

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances, ${deletedSessionInstances} session instances for session schedule ID: ${id}`,
      );

      return deletedSchedule;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for session schedule ID: ${id}`,
        error,
      );
      throw error;
    }
  }

  async removeSessionScheduleBySessions(
    sessionIds: UUID[],
    transaction: Transaction,
  ): Promise<boolean> {
    const isSessionScheduleRemoved =
      await this.sessionScheduleRepository.removeBySessions(
        sessionIds,
        transaction,
      );

    if (!isSessionScheduleRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isSessionScheduleRemoved;
  }
}
