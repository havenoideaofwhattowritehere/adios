import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { SessionRepository } from './session.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { SearchSessionsDto } from './dto/search-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { SessionParticipantService } from '../session-participant/session-participant.service';
import { SessionScheduleService } from '../session-schedule/session-schedule.service';
import { SessionInstanceService } from '../session-instance/session-instance.service';
import { AttendanceService } from '../attendance/attendance.service';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly sessionsRepository: SessionRepository,
    private readonly sessionParticipantService: SessionParticipantService,
    private readonly sessionScheduleService: SessionScheduleService,
    private readonly sessionInstanceService: SessionInstanceService,
    private readonly attendanceService: AttendanceService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createSession(
    createSessionDto: CreateSessionDto,
    clubId: string,
  ): Promise<Session> {
    const sessionDto = {
      ...createSessionDto,
      clubId,
    };

    try {
      const session = await this.sessionsRepository.create(sessionDto);
      this.logger.log(`Session with ID ${session.id} was created`);
      if (sessionDto.participantIds?.length > 0) {
        for (const participantId of sessionDto.participantIds) {
          await this.sessionParticipantService.createSessionParticipant({
            sessionId: session.id,
            clubStudentId: participantId,
          });
        }
      }
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to create session: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }
  }

  async getSessions(
    clubId: string,
    payload?: SearchSessionsDto,
  ): Promise<Session[]> {
    const session = payload
      ? await this.sessionsRepository.findAllWithQuery(clubId, payload)
      : await this.sessionsRepository.findAll(clubId);

    if (!session) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return session;
  }

  async getSessionsByUsers(
    userIds: string[],
    role: UserRole,
  ): Promise<Session[]> {
    const session = await this.sessionsRepository.findAllByUsers(userIds, role);

    if (!session) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return session;
  }

  async getSession(id: UUID): Promise<Session> {
    const session = await this.sessionsRepository.findOne(id);

    if (!session) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return session;
  }

  async isNameInClubValid(clubId: string, name: string): Promise<boolean> {
    return !!!(await this.sessionsRepository.findSessionInClubByName(
      clubId,
      name,
    ));
  }

  async updateSession(
    id: UUID,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const { participantIds, ...sessionDto } = updateSessionDto;

    const isSessionUpdated =
      Object.keys(sessionDto).length !== 0
        ? await this.sessionsRepository.update(id, sessionDto)
        : true;

    if (participantIds) {
      const participantsToAdd = participantIds;
      const participantsToRemove =
        await this.sessionParticipantService.getSessionParticipantIdsBySession(
          id,
        );

      const commonElements = participantsToAdd.filter((element) =>
        participantsToRemove.includes(element),
      );

      const participantIdsToAdd = participantsToAdd.filter(
        (element) => !commonElements.includes(element),
      );
      const participantIdsToRemove = participantsToRemove.filter(
        (element) => !commonElements.includes(element),
      );

      for (const participantId of participantIdsToAdd) {
        await this.sessionParticipantService.createSessionParticipant({
          sessionId: id,
          clubStudentId: participantId,
        });
      }

      for (const participantId of participantIdsToRemove) {
        await this.sessionParticipantService.removeSessionParticipantByStudentAndSession(
          participantId as UUID,
          id,
        );
      }
    }

    if (!isSessionUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.sessionsRepository.findOne(id);
  }

  async removeSession(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const sessionSchedules =
        await this.sessionScheduleService.getSessionSchedulesBySession(id);

      const sessionScheduleIds = sessionSchedules.map(
        (schedule) => schedule.id,
      );

      const sessionInstances =
        await this.sessionInstanceService.getSessionInstancesBySession(id);

      const sessionInstanceIds = sessionInstances.map(
        (instance) => instance.id,
      );

      const attendances =
        await this.attendanceService.getAttendancesBySession(id);

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
              sessionScheduleIds,
              transaction,
            )
          : false;

      const deletedSessionSchedules =
        sessionScheduleIds.length > 0
          ? await this.sessionScheduleService.removeSessionScheduleBySessions(
              [id],
              transaction,
            )
          : false;

      const deletedSession = await this.sessionsRepository.remove(
        id,
        transaction,
      );

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances, ${deletedSessionInstances} session instances, and ${deletedSessionSchedules} session schedules for session ID: ${id}`,
      );

      return deletedSession;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for session ID: ${id}`,
        error,
      );
      throw error;
    }
  }

  async removeSessionsByClubs(clubIds: UUID[], transaction?: Transaction): Promise<boolean> {
    const isSessionRemoved =
      await this.sessionsRepository.removeByClubs(
        clubIds,
        transaction,
      );

    if (!isSessionRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isSessionRemoved;
  }
}
