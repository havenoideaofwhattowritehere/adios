import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { ClubStudentSessionInstanceRepository } from './club-student-session-instance.repository';
import { CreateClubStudentSessionInstanceDto } from './dto/create-club-student-session-instance.dto';
import { UpdateClubStudentSessionInstanceDto } from './dto/update-club-student-session-instance.dto';
import { ClubStudentSessionInstance } from '../../modules/club-student-session-instance/entities/club-student-session-instance.entity';

@Injectable()
export class ClubStudentSessionInstanceService {
  constructor(
    private readonly clubStudentSessionInstanceRepository: ClubStudentSessionInstanceRepository,
  ) {}

  async createClubStudentSessionInstance(
    createClubStudentSessionInstanceDto: CreateClubStudentSessionInstanceDto,
  ): Promise<ClubStudentSessionInstance> {
    const clubStudentSessionInstance =
      await this.clubStudentSessionInstanceRepository.create(
        createClubStudentSessionInstanceDto,
      );

    if (!clubStudentSessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return clubStudentSessionInstance;
  }

  async getClubStudentSessionInstances(): Promise<
    ClubStudentSessionInstance[]
  > {
    const clubStudentSessionInstances =
      await this.clubStudentSessionInstanceRepository.findAll();

    if (!clubStudentSessionInstances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudentSessionInstances;
  }

  async getClubStudentSessionInstance(
    id: UUID,
  ): Promise<ClubStudentSessionInstance> {
    const clubStudentSessionInstance =
      await this.clubStudentSessionInstanceRepository.findOne(id);

    if (!clubStudentSessionInstance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudentSessionInstance;
  }

  async updateClubStudentSessionInstance(
    id: UUID,
    updateClubStudentSessionInstanceDto: UpdateClubStudentSessionInstanceDto,
  ): Promise<ClubStudentSessionInstance> {
    const isClubStudentSessionInstanceUpdated =
      await this.clubStudentSessionInstanceRepository.update(
        id,
        updateClubStudentSessionInstanceDto,
      );

    if (!isClubStudentSessionInstanceUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.clubStudentSessionInstanceRepository.findOne(id);
  }

  async removeClubStudentSessionInstance(id: UUID): Promise<boolean> {
    const isClubStudentSessionInstanceRemoved =
      await this.clubStudentSessionInstanceRepository.remove(id);

    if (!isClubStudentSessionInstanceRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isClubStudentSessionInstanceRemoved;
  }
}
