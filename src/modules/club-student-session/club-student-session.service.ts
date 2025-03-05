import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { ClubStudentSessionRepository } from './club-student-session.repository';
import { CreateClubStudentSessionDto } from './dto/create-club-student-session.dto';
import { UpdateClubStudentSessionDto } from './dto/update-club-student-session.dto';
import { ClubStudentSession } from './entities/club-student-session.entity';

@Injectable()
export class ClubStudentSessionService {
  constructor(
    private readonly clubStudentSessionsRepository: ClubStudentSessionRepository,
  ) {}

  async createClubStudentSession(
    createClubStudentSessionDto: CreateClubStudentSessionDto,
  ): Promise<ClubStudentSession> {
    const clubStudentSession = await this.clubStudentSessionsRepository.create(
      createClubStudentSessionDto,
    );

    if (!clubStudentSession) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return clubStudentSession;
  }

  async getClubStudentSessions(): Promise<ClubStudentSession[]> {
    const clubStudentSessions =
      await this.clubStudentSessionsRepository.findAll();

    if (!clubStudentSessions) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudentSessions;
  }

  async getClubStudentSession(id: UUID): Promise<ClubStudentSession> {
    const clubStudentSession =
      await this.clubStudentSessionsRepository.findOne(id);

    if (!clubStudentSession) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudentSession;
  }

  async updateClubStudentSession(
    id: UUID,
    updateClubStudentSessionDto: UpdateClubStudentSessionDto,
  ): Promise<ClubStudentSession> {
    const isClubStudentSessionUpdated =
      await this.clubStudentSessionsRepository.update(
        id,
        updateClubStudentSessionDto,
      );

    if (!isClubStudentSessionUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.clubStudentSessionsRepository.findOne(id);
  }

  async removeClubStudentSession(id: UUID): Promise<boolean> {
    const isClubStudentSessionRemoved =
      await this.clubStudentSessionsRepository.remove(id);

    if (!isClubStudentSessionRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isClubStudentSessionRemoved;
  }
}
