import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { SessionParticipantRepository } from './session-participant.repository';
import { CreateSessionParticipantDto } from './dto/create-session-participant.dto';
import { UpdateSessionParticipantDto } from './dto/update-session-participant.dto';
import { SessionParticipant } from './entities/session-participant.entity';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class SessionParticipantService {
  private readonly logger = new Logger(SessionParticipantService.name);

  constructor(
    private readonly sessionParticipantRepository: SessionParticipantRepository,
    private readonly attendanceService: AttendanceService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createSessionParticipant(
    createSessionParticipantDto: CreateSessionParticipantDto,
  ): Promise<SessionParticipant> {
    const sessionParticipant = await this.sessionParticipantRepository.create(
      createSessionParticipantDto,
    );

    if (!sessionParticipant) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return sessionParticipant;
  }

  async getSessionParticipants(clubId: string): Promise<SessionParticipant[]> {
    const sessionParticipants =
      await this.sessionParticipantRepository.findAllByClub(clubId);

    if (!sessionParticipants) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipants;
  }

  async getSessionParticipantIdsBySession(sessionId: UUID): Promise<string[]> {
    const sessionParticipants =
      await this.sessionParticipantRepository.findAllBySession(sessionId);

    if (!sessionParticipants) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipants.map((sp) => sp.clubStudentId) as string[];
  }

  async getSessionParticipantsByStudent(
    studentId: UUID,
  ): Promise<SessionParticipant[]> {
    const sessionParticipants =
      await this.sessionParticipantRepository.findAllByStudent(studentId);

    if (!sessionParticipants) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipants;
  }

  async getSessionParticipantsBySession(
    sessionId: UUID,
  ): Promise<SessionParticipant[]> {
    const sessionParticipants =
      await this.sessionParticipantRepository.findAllBySession(sessionId);

    if (!sessionParticipants) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipants;
  }

  async getSessionParticipantsByUsers(
    userIds: UUID[],
  ): Promise<SessionParticipant[]> {
    const sessionParticipants =
      await this.sessionParticipantRepository.findAllByUsers(userIds);

    if (!sessionParticipants) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipants;
  }

  async getSessionParticipant(id: UUID): Promise<SessionParticipant> {
    const sessionParticipant =
      await this.sessionParticipantRepository.findOne(id);

    if (!sessionParticipant) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return sessionParticipant;
  }

  async updateSessionParticipant(
    id: UUID,
    updateSessionParticipantDto: UpdateSessionParticipantDto,
  ): Promise<SessionParticipant> {
    const isSessionParticipantUpdated =
      await this.sessionParticipantRepository.update(
        id,
        updateSessionParticipantDto,
      );

    if (!isSessionParticipantUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.sessionParticipantRepository.findOne(id);
  }

  async removeSessionParticipantsByStudents(
    studentIds: UUID[],
    transaction?: Transaction,
  ): Promise<boolean> {
    const isSessionParticipantRemoved =
      await this.sessionParticipantRepository.removeByStudent(
        studentIds,
        transaction,
      );

    if (!isSessionParticipantRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isSessionParticipantRemoved;
  }

  async removeSessionParticipantsBySession(sessionId: UUID): Promise<boolean> {
    const isSessionParticipantRemoved =
      await this.sessionParticipantRepository.removeBySession(sessionId);

    if (!isSessionParticipantRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isSessionParticipantRemoved;
  }

  async removeSessionParticipantByStudentAndSession(
    studentId: UUID,
    sessionId: UUID,
  ): Promise<boolean> {
    const isSessionParticipantRemoved =
      await this.sessionParticipantRepository.removeByStudentAndSession(
        studentId,
        sessionId,
      );

    if (!isSessionParticipantRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isSessionParticipantRemoved;
  }

  async removeSessionParticipant(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const attendances =
        await this.attendanceService.getAttendancesByParticipant(id);

      const deletedAttendances =
        attendances?.length > 0
          ? await this.attendanceService.removeAttendancesByParticipants(
              [id],
              transaction,
            )
          : false;

      const deletedParticipant = await this.sessionParticipantRepository.remove(
        id,
        transaction,
      );

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances for session participant ID: ${id}`,
      );

      return deletedParticipant;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for session participant ID: ${id}`,
        error,
      );
      throw error;
    }
  }
}
