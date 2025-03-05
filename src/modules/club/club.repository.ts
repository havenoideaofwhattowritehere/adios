import { Inject, Injectable } from '@nestjs/common';
import { UUID } from '../../shared/common/interfaces/types';
import { Transaction } from 'sequelize';

import { REPOSITORIES } from '../../shared/helpers/repositories';
import { CLUB_INCLUDE } from './entities/club.include';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class ClubRepository {
  constructor(
    @Inject(REPOSITORIES.CLUB) private clubsRepository: typeof Club,
  ) {}

  async create(
    createClubDto: CreateClubDto,
    transaction?: Transaction,
  ): Promise<Club> {
    return this.clubsRepository.create<Club>(
      { ...createClubDto },
      { include: CLUB_INCLUDE.create(), transaction },
    );
  }

  async findAll(): Promise<Club[]> {
    return this.clubsRepository.findAll({
      include: CLUB_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<Club> {
    return this.clubsRepository.findOne({
      where: { id },
      include: CLUB_INCLUDE.getOne(),
    });
  }

  async findClubsByUserId(userId: UUID, role): Promise<Club[]> {
    return this.clubsRepository.findAll({
      include: [
        {
          model: User,
          as: role,
          attributes: [],
          where: { id: userId },
          through: { attributes: [] },
        },
      ],
    });
  }

  async findClubsByUserIds(userIds: UUID[], role: UserRole): Promise<Club[]> {
    return this.clubsRepository.findAll({
      include: [
        {
          model: User,
          as: role,
          attributes: [],
          where: { id: userIds },
          through: { attributes: [] },
        },
      ],
    });
  }

  async findClubByName(name: string): Promise<Club> {
    return this.clubsRepository.findOne({
      where: { name },
      include: CLUB_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateClubDto: UpdateClubDto,
    transaction?: Transaction,
  ): Promise<boolean> {
    const club = await this.clubsRepository.update(updateClubDto, {
      where: { id },
      transaction,
    });
    return Boolean(club[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const club = await this.clubsRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(club);
  }

  async removeClubs(ids: UUID[], transaction?: Transaction): Promise<boolean> {
    const club = await this.clubsRepository.destroy({
      where: { id: ids },
      transaction,
    });
    return Boolean(club);
  }
}
