import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import * as dayjs from 'dayjs';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { SessionInstanceRepository } from './session-instance.repository';
import { CreateSessionInstanceDto } from './dto/create-session-instance.dto';
import { UpdateSessionInstanceDto } from './dto/update-session-instance.dto';
import { SessionInstance } from './entities/session-instance.entity';
import { SessionSchedule } from '../session-schedule/entities/session-schedule.entity';
import { DateUtil } from '../../shared/common/utils/date/date.util';
import { SearchSessionInstanceDto } from './dto/search-session-instance.dto';
import { GetSessionInstanceDto } from './dto/get-session-instance.dto';
import { AttendanceService } from '../attendance/attendance.service';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class SessionInstanceService {
  private readonly logger = new Logger(SessionInstanceService.name);
  constructor(
    private readonly sessionInstanceRepository: SessionInstanceRepository,
    private readonly attendanceService: AttendanceService,
    private readonly dateUtil: DateUtil,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createSessionInstance(
    createSessionInstanceDto: CreateSessionInstanceDto,
    clubId: string,
  ): Promise<SessionInstance> {
    const sessionInstanceDto = {
      ...createSessionInstanceDto,
      clubId,
    };

    try {
      const sessionInstance =
        await this.sessionInstanceRepository.create(sessionInstanceDto);
      this.logger.log(
        `Session instance with ID ${sessionInstance.id} was created`,
      );
      return sessionInstance;
    } catch (error) {
      this.logger.error(
        `Failed to create session instance: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }
  }

  async createSessionInstances(
    createSessionInstanceDtos: CreateSessionInstanceDto[],
  ): Promise<SessionInstance[]> {
    return this.sequelize.transaction(async (transaction) => {
      const sessionInstances = await this.sessionInstanceRepository.bulkCreate(
        createSessionInstanceDtos,
        transaction,
      );

      let attendanceDtos = [];
      for (const instance of sessionInstances) {
        const participants =
          instance.sessionSchedule.session.sessionParticipants;
        for (const participant of participants) {
          attendanceDtos.push({
            attended: false,
            sessionInstanceId: instance.id,
            sessionStudentId: participant.id,
          });
        }
      }

      const attendances = await this.attendanceService.createAttendances(
        attendanceDtos,
        transaction,
      );

      if (!sessionInstances || !attendances) {
        throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
      }

      return sessionInstances;
    });
  }

  async getSessionInstances(
    clubId: string,
    payload?: SearchSessionInstanceDto,
  ): Promise<GetSessionInstanceDto[]> {
    let sessionInstances: SessionInstance[];
    if (payload) {
      const startDate = payload.date;
      const endDate = dayjs(startDate).add(payload.days, 'day').toDate();
      sessionInstances =
        await this.sessionInstanceRepository.findAllByDateRange(
          clubId,
          startDate,
          endDate,
        );
    } else {
      sessionInstances = await this.sessionInstanceRepository.findAll(clubId);
    }

    if (!sessionInstances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return this.mapSessionInstances(sessionInstances);
  }

  async mapSessionInstances(
    sessionInstances: SessionInstance[],
  ): Promise<GetSessionInstanceDto[]> {
    return sessionInstances.map((instance) => ({
      id: instance.id,
      title: instance.sessionSchedule.session?.name,
      location: instance.sessionSchedule.session?.location,
      people: instance.attendances.map((attendance) => ({
        studentId: attendance.sessionParticipant?.clubStudent?.id,
        firstName: attendance.sessionParticipant?.clubStudent?.user?.firstName,
        lastName: attendance.sessionParticipant?.clubStudent?.user?.lastName,
        attended: attendance.attended,
      })),
      start: instance.datetime,
      end: dayjs(instance.datetime)
        .add(instance.durationMinutes, 'minute')
        .toDate(),
    }));
  }

  async getSessionInstance(id: UUID): Promise<SessionInstance> {
    const sessionInstance = await this.sessionInstanceRepository.findOne(id);

    if (!sessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionInstance;
  }

  async getSessionInstancesBySession(
    sessionId: UUID,
  ): Promise<SessionInstance[]> {
    const sessionInstance =
      await this.sessionInstanceRepository.findAllBySessionId(sessionId);

    if (!sessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionInstance;
  }

  async getSessionInstancesByUsers(
    userIds: UUID[],
    role: UserRole,
  ): Promise<SessionInstance[]> {
    const sessionInstances =
      await this.sessionInstanceRepository.findAllByUsers(userIds, role);

    if (!sessionInstances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionInstances;
  }

  async getSessionInstancesBySchedule(
    scheduleId: UUID,
  ): Promise<SessionInstance[]> {
    const sessionInstance =
      await this.sessionInstanceRepository.findAllByScheduleId(scheduleId);

    if (!sessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionInstance;
  }

  async getInstanceByScheduleId(scheduleId: UUID): Promise<SessionInstance> {
    const sessionInstance =
      await this.sessionInstanceRepository.findByScheduleId(scheduleId);

    if (!sessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionInstance;
  }

  async updateSessionInstance(
    id: UUID,
    updateSessionInstanceDto: UpdateSessionInstanceDto,
  ): Promise<SessionInstance> {
    const isSessionInstanceUpdated =
      await this.sessionInstanceRepository.update(id, updateSessionInstanceDto);

    if (!isSessionInstanceUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.sessionInstanceRepository.findOne(id);
  }

  async createSessionInstancesForToday(
    sessionSchedules: SessionSchedule[],
    currentDate: Date,
  ): Promise<void> {
    const dayOfWeek = currentDate.getUTCDay();

    for (const schedule of sessionSchedules) {
      const scheduleDayMask = schedule.dayOfWeekMask;
      if (this.isTodayScheduled(scheduleDayMask, dayOfWeek)) {
        await this.createSessionInstanceFromSchedule(
          schedule,
          currentDate,
          schedule.session?.clubId,
        );
      }
    }
  }

  private isTodayScheduled(
    scheduleDayMask: string,
    dayOfWeek: number,
  ): boolean {
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7;
    const mask = parseInt(scheduleDayMask, 2);
    return (mask & (1 << (6 - adjustedDayOfWeek))) !== 0;
  }

  async createSessionInstanceFromSchedule(
    schedule: SessionSchedule,
    currentDate: Date,
    clubId: string,
  ): Promise<void> {
    const sessionTime = await this.dateUtil.combineDateAndTime(
      currentDate,
      schedule.time,
    );

    const sessionInstanceDTO = new CreateSessionInstanceDto();
    sessionInstanceDTO.datetime = sessionTime;
    sessionInstanceDTO.durationMinutes = schedule.durationMinutes;
    sessionInstanceDTO.sessionScheduleId = schedule.id;
    sessionInstanceDTO.isCanceled = false;

    await this.createSessionInstance(sessionInstanceDTO, clubId);
    this.logger.log(`Session instance created for schedule ID: ${schedule.id}`);
  }

  // async removeSessionInstance(id: UUID): Promise<boolean> {
  //   const isSessionInstanceRemoved =
  //     await this.sessionInstanceRepository.remove(id);

  //   if (!isSessionInstanceRemoved) {
  //     throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
  //   }

  //   return isSessionInstanceRemoved;
  // }

  async removeSessionInstance(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const attendances =
        await this.attendanceService.getAttendancesByInstance(id);

      const deletedAttendances =
        attendances?.length > 0
          ? await this.attendanceService.removeAttendancesByInstances(
              [id],
              transaction,
            )
          : false;

      const deletedInstance = await this.sessionInstanceRepository.remove(
        id,
        transaction,
      );

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances for session instance ID: ${id}`,
      );

      return deletedInstance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for session instance ID: ${id}`,
        error,
      );
      throw error;
    }
  }

  async removeSessionInstancesBySchedules(
    scheduleIds: UUID[],
    transaction?: Transaction,
  ): Promise<void> {
    const removedInstances =
      await this.sessionInstanceRepository.removeByScheduleIds(
        scheduleIds,
        transaction,
      );
    if (!removedInstances) {
      this.logger.warn(
        `No session instances found for session ID: ${scheduleIds}`,
      );
    } else {
      this.logger.log(
        `Removed ${removedInstances} session instances for session ID: ${scheduleIds}`,
      );
    }
  }
}
