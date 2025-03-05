import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { SESSION_PARTICIPANT_INCLUDE } from './entities/session-participant.include';
import { UpdateSessionParticipantDto } from './dto/update-session-participant.dto';
import { CreateSessionParticipantDto } from './dto/create-session-participant.dto';
import { SessionParticipant } from './entities/session-participant.entity';

@Injectable()
export class SessionParticipantRepository {
  constructor(
    @Inject(REPOSITORIES.SESSION_PARTICIPANT)
    private sessionsParticipantRepository: typeof SessionParticipant,
  ) {}

  async create(
    createSessionParticipantDto: CreateSessionParticipantDto,
  ): Promise<SessionParticipant> {
    return this.sessionsParticipantRepository.create<SessionParticipant>(
      {
        ...createSessionParticipantDto,
      },
      { include: SESSION_PARTICIPANT_INCLUDE.create() },
    );
  }
  async findAll(): Promise<SessionParticipant[]> {
    return this.sessionsParticipantRepository.findAll({
      include: SESSION_PARTICIPANT_INCLUDE.getAll(),
    });
  }

  async findAllByClub(clubId: string): Promise<SessionParticipant[]> {
    return this.sessionsParticipantRepository.findAll({
      include: SESSION_PARTICIPANT_INCLUDE.getAllByClub(clubId),
    });
  }

  async findAllByStudent(clubStudentId: UUID): Promise<SessionParticipant[]> {
    return this.sessionsParticipantRepository.findAll({
      where: { clubStudentId },
      include: SESSION_PARTICIPANT_INCLUDE.getAll(),
    });
  }

  async findAllBySession(sessionId: UUID): Promise<SessionParticipant[]> {
    return this.sessionsParticipantRepository.findAll({
      where: { sessionId },
      include: SESSION_PARTICIPANT_INCLUDE.getAll(),
    });
  }

  async findAllByUsers(userIds: UUID[]): Promise<SessionParticipant[]> {
    return this.sessionsParticipantRepository.findAll({
      include: SESSION_PARTICIPANT_INCLUDE.getAllByUsers(userIds),
    });
  }

  async findOne(id: UUID): Promise<SessionParticipant> {
    return this.sessionsParticipantRepository.findOne({
      where: { id },
      include: SESSION_PARTICIPANT_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateSessionParticipantDto: UpdateSessionParticipantDto,
  ): Promise<boolean> {
    const sessionParticipant = await this.sessionsParticipantRepository.update(
      updateSessionParticipantDto,
      {
        where: { id },
      },
    );
    return Boolean(sessionParticipant[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const sessionParticipant = await this.sessionsParticipantRepository.destroy(
      { where: { id }, transaction },
    );
    return Boolean(sessionParticipant);
  }

  async removeByStudent(studentIds: string[], transaction?: Transaction): Promise<boolean> {
    const sessionParticipant = await this.sessionsParticipantRepository.destroy(
      { where: { clubStudentId: studentIds }, transaction },
    );
    return Boolean(sessionParticipant);
  }

  async removeBySession(sessionId: string): Promise<boolean> {
    const sessionParticipant = await this.sessionsParticipantRepository.destroy(
      { where: { sessionId: sessionId } },
    );
    return Boolean(sessionParticipant);
  }

  async removeByStudentAndSession(
    studentId: string,
    sessionId: string,
  ): Promise<boolean> {
    const sessionParticipant = await this.sessionsParticipantRepository.destroy(
      { where: { clubStudentId: studentId, sessionId: sessionId } },
    );
    return Boolean(sessionParticipant);
  }
}
