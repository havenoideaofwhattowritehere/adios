import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { CLUB_STUDENT_INCLUDE } from './entities/club-student.include';
import { CreateClubStudentDto } from './dto/create-club-student.dto';
import { UpdateClubStudentDto } from './dto/update-club-student.dto';
import { ClubStudent } from './entities/club-student.entity';
import { SearchClubStudentsDto } from './dto/search-club-student.dto';

@Injectable()
export class ClubStudentRepository {
  constructor(
    @Inject(REPOSITORIES.CLUB_STUDENT)
    private clubStudentsRepository: typeof ClubStudent,
  ) {}

  async create(
    createClubStudentDto: CreateClubStudentDto,
    transaction?: Transaction,
  ): Promise<ClubStudent> {
    return this.clubStudentsRepository.create<ClubStudent>(
      {
        ...createClubStudentDto,
      },
      { include: CLUB_STUDENT_INCLUDE.create(), transaction },
    );
  }

  async findAll(clubId: UUID): Promise<ClubStudent[]> {
    return this.clubStudentsRepository.findAll({
      where: { clubId },
      include: CLUB_STUDENT_INCLUDE.getAll(),
    });
  }

  async findAllByUser(userId: UUID): Promise<ClubStudent[]> {
    return this.clubStudentsRepository.findAll({
      where: { userId },
      include: CLUB_STUDENT_INCLUDE.getAll(),
    });
  }

  async findAllByUsers(userIds: UUID[]): Promise<ClubStudent[]> {
    return this.clubStudentsRepository.findAll({
      where: { userId: userIds },
      include: CLUB_STUDENT_INCLUDE.getAll(),
    });
  }

  async findAllWithQuery(
    clubId: string,
    payload?: SearchClubStudentsDto,
  ): Promise<ClubStudent[]> {
    return this.clubStudentsRepository.findAll({
      where: { clubId },
      include: CLUB_STUDENT_INCLUDE.getAllWithQuery(payload),
    });
  }

  async findOne(id: UUID): Promise<ClubStudent> {
    return this.clubStudentsRepository.findOne({
      where: { id },
      include: CLUB_STUDENT_INCLUDE.getOne(),
    });
  }

  async findByRecord(userId: UUID, clubId: UUID): Promise<ClubStudent> {
    return this.clubStudentsRepository.findOne({
      where: { userId, clubId },
      include: CLUB_STUDENT_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateClubStudentDto: UpdateClubStudentDto,
  ): Promise<boolean> {
    const clubStudent = await this.clubStudentsRepository.update(
      updateClubStudentDto,
      {
        where: { id },
      },
    );
    return Boolean(clubStudent[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const clubStudent = await this.clubStudentsRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(clubStudent);
  }

  async removeByUser(userId: UUID, transaction?: Transaction): Promise<boolean> {
    const clubStudent = await this.clubStudentsRepository.destroy({
      where: { userId },
      transaction,
    });
    return Boolean(clubStudent);
  }

  async removeByClubs(clubIds: UUID[], transaction?: Transaction): Promise<boolean> {
    const clubStudent = await this.clubStudentsRepository.destroy({
      where: { clubId: clubIds },
      transaction,
    });
    return Boolean(clubStudent);
  }
}
