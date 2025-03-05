import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Op } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { SESSION_INSTANCE_INCLUDE } from './entities/session-instance.include';
import { CreateSessionInstanceDto } from './dto/create-session-instance.dto';
import { UpdateSessionInstanceDto } from './dto/update-session-instance.dto';
import { SessionInstance } from './entities/session-instance.entity';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class SessionInstanceRepository {
  constructor(
    @Inject(REPOSITORIES.SESSION_INSTANCE)
    private sessionsInstanceRepository: typeof SessionInstance,
  ) {}

  async create(
    createSessionInstanceDto: CreateSessionInstanceDto,
  ): Promise<SessionInstance> {
    return this.sessionsInstanceRepository.create<SessionInstance>(
      {
        ...createSessionInstanceDto,
      },
      { include: SESSION_INSTANCE_INCLUDE.create() },
    );
  }

  async bulkCreate(
    payload: CreateSessionInstanceDto[],
    transaction: Transaction,
  ): Promise<SessionInstance[]> {
    const sessionInstances = await this.sessionsInstanceRepository.bulkCreate(
      payload,
      {
        transaction,
        include: SESSION_INSTANCE_INCLUDE.create(),
      },
    );
    const sessionInstanceIds = sessionInstances.map((instance) => instance.id);
    const populatedInstances = await this.sessionsInstanceRepository.findAll({
      where: { id: sessionInstanceIds },
      include: SESSION_INSTANCE_INCLUDE.getAllAfterCreate(),
      transaction,
    });
    return populatedInstances;
  }

  async findAll(clubId: string): Promise<SessionInstance[]> {
    return this.sessionsInstanceRepository.findAll({
      include: SESSION_INSTANCE_INCLUDE.getAll(clubId),
    });
  }

  async findAllByUsers(userIds: UUID[], role: UserRole): Promise<SessionInstance[]> {
    return this.sessionsInstanceRepository.findAll({
      include: SESSION_INSTANCE_INCLUDE.getAllByUsers(userIds, role),
    });
  }

  async findAllByDateRange(
    clubId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SessionInstance[]> {
    return this.sessionsInstanceRepository.findAll({
      where: {
        datetime: { [Op.between as symbol]: [startDate, endDate] },
      },
      order: [['datetime', 'ASC']],
      include: SESSION_INSTANCE_INCLUDE.getAll(clubId),
    });
  }

  async findAllByScheduleId(scheduleId: UUID): Promise<SessionInstance[]> {
    return this.sessionsInstanceRepository.findAll({
      where: { sessionScheduleId: scheduleId },
    });
  }

  async findAllBySessionId(sessionId: UUID): Promise<SessionInstance[]> {
    return this.sessionsInstanceRepository.findAll({
      include: SESSION_INSTANCE_INCLUDE.getAllBySession(sessionId),
    });
  }

  async findOne(id: UUID): Promise<SessionInstance> {
    return this.sessionsInstanceRepository.findOne({
      where: { id },
      include: SESSION_INSTANCE_INCLUDE.getOne(),
    });
  }

  async findByScheduleId(scheduleId: UUID): Promise<SessionInstance | null> {
    return this.sessionsInstanceRepository.findOne({
      where: { sessionScheduleId: scheduleId },
    });
  }

  async update(
    id: UUID,
    updateSessionInstanceDto: UpdateSessionInstanceDto,
  ): Promise<boolean> {
    const sessionInstance = await this.sessionsInstanceRepository.update(
      updateSessionInstanceDto,
      {
        where: { id },
      },
    );
    return Boolean(sessionInstance[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const sessionInstance = await this.sessionsInstanceRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(sessionInstance);
  }

  async removeByScheduleId(scheduleId: UUID): Promise<number> {
    return this.sessionsInstanceRepository.destroy({
      where: {
        sessionScheduleId: scheduleId,
      },
    });
  }

  async removeByScheduleIds(
    scheduleIds: UUID[],
    transaction: Transaction,
  ): Promise<number> {
    return this.sessionsInstanceRepository.destroy({
      where: {
        sessionScheduleId: scheduleIds,
      },
      transaction,
    });
  }
}
