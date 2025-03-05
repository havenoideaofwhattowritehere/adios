import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { ClubStaffRepository } from './club-staff.repository';
import { CreateClubStaffDto } from './dto/create-club-staff.dto';
import { UpdateClubStaffDto } from './dto/update-club-staff.dto';
import { ClubStaff } from './entities/club-staff.entity';

@Injectable()
export class ClubStaffService {
  constructor(private readonly clubStaffsRepository: ClubStaffRepository) {}

  async createClubStaff(
    createClubStaffDto: CreateClubStaffDto,
    transaction?: Transaction,
  ): Promise<ClubStaff> {
    const clubStaff = await this.clubStaffsRepository.create(
      createClubStaffDto,
      transaction,
    );

    if (!clubStaff) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return clubStaff;
  }

  async getClubStaffs(): Promise<ClubStaff[]> {
    const clubStaffs = await this.clubStaffsRepository.findAll();

    if (!clubStaffs) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStaffs;
  }

  async getClubStaff(id: UUID): Promise<ClubStaff> {
    const clubStaff = await this.clubStaffsRepository.findOne(id);

    if (!clubStaff) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStaff;
  }

  async getClubStaffByRecord(userId: UUID, clubId: UUID): Promise<ClubStaff> {
    return this.clubStaffsRepository.findByRecord(userId, clubId);
  }

  async updateClubStaff(
    id: UUID,
    updateClubStaffDto: UpdateClubStaffDto,
    transaction?: Transaction,
  ): Promise<ClubStaff> {
    const isClubStaffUpdated = await this.clubStaffsRepository.update(
      id,
      updateClubStaffDto,
      transaction,
    );

    if (!isClubStaffUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.clubStaffsRepository.findOne(id);
  }

  async removeClubStaff(id: UUID, transaction?: Transaction): Promise<boolean> {
    const isClubStaffRemoved = await this.clubStaffsRepository.remove(
      id,
      transaction,
    );

    if (!isClubStaffRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isClubStaffRemoved;
  }
}
