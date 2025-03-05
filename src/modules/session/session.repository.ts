import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { SESSION_INCLUDE } from './entities/session.include';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { SearchSessionsDto } from './dto/search-session.dto';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class SessionRepository {
  constructor(
    @Inject(REPOSITORIES.SESSION) private sessionsRepository: typeof Session,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionsRepository.create<Session>(
      { ...createSessionDto },
      { include: SESSION_INCLUDE.create() },
    );
  }

  async findAll(clubId: string): Promise<Session[]> {
    return this.sessionsRepository.findAll({
      where: { clubId },
      include: SESSION_INCLUDE.getAll(),
    });
  }

  async findAllByUsers(userIds: string[], role: UserRole): Promise<Session[]> {
    return this.sessionsRepository.findAll({
      include: SESSION_INCLUDE.getAllByUsers(userIds, role),
    });
  }

  async findAllWithQuery(
    clubId: string,
    payload?: SearchSessionsDto,
  ): Promise<Session[]> {
    return this.sessionsRepository.findAll({
      where: payload?.name
        ? {
            clubId,
            name: { [Op.like as symbol]: `%${payload.name}%` },
          }
        : { clubId },
      include: SESSION_INCLUDE.getAllWithQuery(payload),
    });
  }

  async findOne(id: UUID): Promise<Session> {
    return this.sessionsRepository.findOne({
      where: { id },
      include: SESSION_INCLUDE.getOne(),
    });
  }

  async findSessionInClubByName(
    clubId: string,
    name: string,
  ): Promise<Session> {
    return this.sessionsRepository.findOne({
      where: { clubId, name },
      include: SESSION_INCLUDE.getOne(),
    });
  }

  async update(id: UUID, updateSessionDto: UpdateSessionDto): Promise<boolean> {
    const session = await this.sessionsRepository.update(updateSessionDto, {
      where: { id },
    });
    return Boolean(session[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const session = await this.sessionsRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(session);
  }

  async removeByClubs(clubIds: UUID[], transaction?: Transaction): Promise<boolean> {
    const session = await this.sessionsRepository.destroy({
      where: { clubId: clubIds },
      transaction,
    });
    return Boolean(session);
  }
}
