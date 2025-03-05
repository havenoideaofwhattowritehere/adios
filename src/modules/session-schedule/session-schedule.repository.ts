import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { UUID } from '../../shared/common/interfaces/types';

import { REPOSITORIES } from '../../shared/helpers/repositories';
import { SESSION_SCHEDULE_INCLUDE } from './entities/session-schedule.include';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';
import { SessionSchedule } from './entities/session-schedule.entity';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class SessionScheduleRepository {
  constructor(
    @Inject(REPOSITORIES.SESSION_SCHEDULE)
    private sessionScheduleRepository: typeof SessionSchedule,
  ) {}

  async create(
    createSessionScheduleDto: CreateSessionScheduleDto,
  ): Promise<SessionSchedule> {
    return this.sessionScheduleRepository.create<SessionSchedule>(
      {
        ...createSessionScheduleDto,
      },
      { include: SESSION_SCHEDULE_INCLUDE.create() },
    );
  }

  async findAll(clubId: UUID): Promise<SessionSchedule[]> {
    return this.sessionScheduleRepository.findAll({
      include: SESSION_SCHEDULE_INCLUDE.getAllByClub(clubId),
    });
  }

  async findAllBySession(sessionId: UUID): Promise<SessionSchedule[]> {
    return this.sessionScheduleRepository.findAll({
      where: { sessionId },
      include: SESSION_SCHEDULE_INCLUDE.getAll(),
    });
  }

  async findAllByUsers(userIds: UUID[], role: UserRole): Promise<SessionSchedule[]> {
    return this.sessionScheduleRepository.findAll({
      include: SESSION_SCHEDULE_INCLUDE.getAllByUsers(userIds, role),
    });
  }

  async findOne(id: UUID): Promise<SessionSchedule> {
    return this.sessionScheduleRepository.findOne({
      where: { id },
      include: SESSION_SCHEDULE_INCLUDE.getOne(),
    });
  }

  async findActiveSchedules(currentDate: Date): Promise<SessionSchedule[]> {
    return this.sessionScheduleRepository.findAll({
      where: {
        [Op.and]: [
          { startDate: { [Op.lte]: currentDate } },
          { endDate: { [Op.gte]: currentDate } },
        ],
      },
    });
  }

  async findParanoid(id: UUID): Promise<SessionSchedule> {
    return this.sessionScheduleRepository.findOne({
      where: { id },
      include: SESSION_SCHEDULE_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateSessionScheduleDto: UpdateSessionScheduleDto,
  ): Promise<boolean> {
    const sessionSchedule = await this.sessionScheduleRepository.update(
      updateSessionScheduleDto,
      {
        where: { id },
      },
    );
    return Boolean(sessionSchedule[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const sessionSchedule = await this.sessionScheduleRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(sessionSchedule);
  }

  async removeBySessions(
    sessionIds: UUID[],
    transaction: Transaction,
  ): Promise<boolean> {
    const sessionSchedule = await this.sessionScheduleRepository.destroy({
      where: { sessionId: sessionIds },
      transaction,
    });
    return Boolean(sessionSchedule);
  }
}
