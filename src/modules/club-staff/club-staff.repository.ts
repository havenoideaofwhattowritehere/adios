import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { CLUB_STAFF_INCLUDE } from './entities/club-staff.include';
import { CreateClubStaffDto } from './dto/create-club-staff.dto';
import { UpdateClubStaffDto } from './dto/update-club-staff.dto';
import { ClubStaff } from './entities/club-staff.entity';

@Injectable()
export class ClubStaffRepository {
  constructor(
    @Inject(REPOSITORIES.CLUB_STAFF)
    private clubStaffsRepository: typeof ClubStaff,
  ) {}

  async create(
    createClubStaffDto: CreateClubStaffDto,
    transaction?: Transaction,
  ): Promise<ClubStaff> {
    return this.clubStaffsRepository.create<ClubStaff>(
      {
        ...createClubStaffDto,
      },
      { include: CLUB_STAFF_INCLUDE.create(), transaction },
    );
  }

  async findAll(): Promise<ClubStaff[]> {
    return this.clubStaffsRepository.findAll({
      include: CLUB_STAFF_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<ClubStaff> {
    return this.clubStaffsRepository.findOne({
      where: { id },
      include: CLUB_STAFF_INCLUDE.getOne(),
    });
  }

  async findByRecord(userId: UUID, clubId: UUID): Promise<ClubStaff> {
    return this.clubStaffsRepository.findOne({
      where: { userId, clubId },
      include: CLUB_STAFF_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateClubStaffDto: UpdateClubStaffDto,
    transaction?: Transaction,
  ): Promise<boolean> {
    const clubStaff = await this.clubStaffsRepository.update(
      updateClubStaffDto,
      {
        where: { id },
        transaction,
      },
    );
    return Boolean(clubStaff[0]);
  }

  async remove(id: UUID, transaction?: Transaction): Promise<boolean> {
    const clubStaff = await this.clubStaffsRepository.destroy({
      where: { id },
      transaction,
    });
    return Boolean(clubStaff);
  }
}
