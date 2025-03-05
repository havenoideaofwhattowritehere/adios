import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UUID } from '../../shared/common/interfaces/types';
import { Sequelize, Transaction } from 'sequelize';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { ClubRepository } from './club.repository';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { UserService } from '../user/user.service';
import { UserRole } from '../../shared/helpers/roles.enum';
import { SessionService } from '../session/session.service';
import { SessionScheduleService } from '../session-schedule/session-schedule.service';
import { SessionInstanceService } from '../session-instance/session-instance.service';
import { ClubStudentService } from '../club-student/club-student.service';
import { SessionParticipantService } from '../session-participant/session-participant.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class ClubService {
  private readonly logger = new Logger(ClubService.name);
  constructor(
    private readonly clubsRepository: ClubRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly sessionScheduleService: SessionScheduleService,
    private readonly sessionInstanceService: SessionInstanceService,
    private readonly clubStudentService: ClubStudentService,
    private readonly sessionParticipantService: SessionParticipantService,
    private readonly attendanceService: AttendanceService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createClub(
    createClubDto: CreateClubDto,
    transaction?: Transaction,
  ): Promise<Club> {
    const isNameValid = await this.isNameValid(createClubDto.name);
    if (!isNameValid) {
      throw new BadRequestException(ErrorMap.CLUB_ALREADY_EXISTS);
    }

    const club = await this.clubsRepository.create(createClubDto, transaction);

    if (!club) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return club;
  }

  async getClubsForUser(
    auth0UserId: UUID,
    role: UserRole.staff | UserRole.student,
  ): Promise<Club[]> {
    const user = await this.userService.getMe(auth0UserId);

    if (!user) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }
    return this.clubsRepository.findClubsByUserId(user.id, role);
  }

  async getClubsByUsers(userIds: UUID[], role: UserRole): Promise<Club[]> {
    const clubs = this.clubsRepository.findClubsByUserIds(
      userIds,
      role
    );

    if (!clubs) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubs;
  }

  async getClubs(): Promise<Club[]> {
    const clubs = await this.clubsRepository.findAll();

    if (!clubs) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubs;
  }

  async getClub(id: UUID): Promise<Club> {
    const club = await this.clubsRepository.findOne(id);

    if (!club) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return club;
  }

  async isNameValid(name: string): Promise<boolean> {
    return !!!(await this.clubsRepository.findClubByName(name));
  }

  async updateClub(
    id: UUID,
    updateClubDto: UpdateClubDto,
    transaction?: Transaction,
  ): Promise<Club> {
    const isClubUpdated = await this.clubsRepository.update(
      id,
      updateClubDto,
      transaction,
    );

    if (!isClubUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.clubsRepository.findOne(id);
  }

  async removeClub(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const sessions = await this.sessionService.getSessions(id);

      const sessionIds = sessions.map((session) => session.id);

      const clubStudents = await this.clubStudentService.getClubStudents(id);

      const clubStudentIds = clubStudents.map((clubStudent) => clubStudent.id);

      const sessionParticipants =
        await this.sessionParticipantService.getSessionParticipants(id);

      const sessionParticipantIds = sessionParticipants.map(
        (sessionParticipant) => sessionParticipant.id,
      );

      const sessionSchedules =
        await this.sessionScheduleService.getSessionSchedules(id);

      const sessionScheduleIds = sessionSchedules.map(
        (schedule) => schedule.id,
      );

      const sessionInstances =
        await this.sessionInstanceService.getSessionInstances(id);

      const sessionInstanceIds = sessionInstances.map(
        (instance) => instance.id,
      );

      const attendances = await this.attendanceService.getAttendances(id);

      const deletedAttendances =
        attendances?.length > 0
          ? await this.attendanceService.removeAttendancesByInstances(
              sessionInstanceIds,
              transaction,
            )
          : false;

      const deletedSessionInstances =
        sessionInstanceIds.length > 0
          ? await this.sessionInstanceService.removeSessionInstancesBySchedules(
              sessionScheduleIds,
              transaction,
            )
          : false;

      const deletedSessionSchedules =
        sessionScheduleIds.length > 0
          ? await this.sessionScheduleService.removeSessionScheduleBySessions(
              sessionIds,
              transaction,
            )
          : false;

      const deletedSessionParticipants =
        sessionParticipantIds.length > 0
          ? await this.sessionParticipantService.removeSessionParticipantsByStudents(
              clubStudentIds,
              transaction,
            )
          : false;

      const deletedSessions =
        sessionIds.length > 0
          ? await this.sessionService.removeSessionsByClubs([id], transaction)
          : false;

      const deletedClubStudents =
        clubStudentIds.length > 0
          ? await this.clubStudentService.removeStudentsByClubs([id], transaction)
          : false;

      const isClubRemoved = await this.clubsRepository.remove(id, transaction);

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances, ${deletedSessionInstances} session instances, ${deletedSessionSchedules} session schedules, ${deletedSessionParticipants} session participants, ${deletedSessions} sessions, ${deletedClubStudents} club students for club ID: ${id}`,
      );

      return isClubRemoved;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for club ID: ${id}`,
        error,
      );
      throw error;
    }
  }

  async removeClubsByUsers(
    userIds: UUID[],
    transaction?: Transaction,
  ): Promise<boolean> {
    const clubs = await this.getClubsByUsers(userIds, UserRole.staff);
    const clubIds = clubs.map((club) => club.id);
    const deletedClubs = await this.clubsRepository.removeClubs(
      clubIds,
      transaction,
    );

    if (!deletedClubs) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return deletedClubs;
  }
}
