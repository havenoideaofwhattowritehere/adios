import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ClubService } from '../club/club.service';
import { ClubStudentService } from '../club-student/club-student.service';
import { SessionService } from '../session/session.service';
import { SessionScheduleService } from '../session-schedule/session-schedule.service';
import { SessionInstanceService } from '../session-instance/session-instance.service';
import { SessionParticipantService } from '../session-participant/session-participant.service';
import { AttendanceService } from '../attendance/attendance.service';
import { UserRole } from '../../shared/helpers/roles.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(forwardRef(() => ClubService))
    private readonly clubService: ClubService,
    private readonly sessionService: SessionService,
    private readonly sessionScheduleService: SessionScheduleService,
    private readonly sessionInstanceService: SessionInstanceService,
    private readonly clubStudentService: ClubStudentService,
    private readonly sessionParticipantService: SessionParticipantService,
    private readonly attendanceService: AttendanceService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    transaction?: Transaction,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.create(
        createUserDto,
        transaction,
      );

      if (!user) {
        throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }
  }

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.findAll();

    if (!users) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }
    return users;
  }

  async getMe(auth0UserId: string): Promise<User> {
    return await this.usersRepository.findByAuth0UserId(auth0UserId);
  }

  async getUserMe(
    auth0UserId: string,
  ): Promise<User | { isRegistrationCompleted: boolean }> {
    const user = await this.getMe(auth0UserId);
    if (!user || !this.checkIfAllFieldsCompleted(user)) {
      this.logger.warn(`User with auth0UserId: ${auth0UserId} not found`);
      return { isRegistrationCompleted: false };
    }
    await this.updateRegistrationStatus(user.id, true);
    return this.getUser(user.id);
  }

  checkIfAllFieldsCompleted(user: User): boolean {
    return !!(
      user.lastName &&
      user.firstName &&
      user.phone &&
      user.clubsAsStaff?.length
    );
  }

  async updateRegistrationStatus(id: UUID, status: boolean): Promise<void> {
    const updateUser: UpdateUserDto = { isRegistrationCompleted: status };
    await this.updateUser(id, updateUser);
  }

  async getUser(id: UUID): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return user;
  }

  async getUsersAuth0Ids(ids: UUID[]): Promise<UUID[]> {
    const users = await this.usersRepository.findAllByIds(ids);
    return users.map((user) => user.auth0UserId);
  }

  async isPhoneValid(phone: string): Promise<boolean> {
    return !!!(await this.usersRepository.findUserByPhone(phone));
  }

  async findUserByPhone(phone: string): Promise<User> {
    return this.usersRepository.findUserByPhone(phone);
  }

  async updateUser(
    id: UUID,
    updateUserDto: UpdateUserDto,
    transaction?: Transaction,
  ): Promise<User> {
    const isUserUpdated = await this.usersRepository.update(
      id,
      updateUserDto,
      transaction,
    );

    if (!isUserUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.usersRepository.findOne(id);
  }

  async removeUsers(ids: UUID[]): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const staffRole = UserRole.staff;

      const clubs = await this.clubService.getClubsByUsers(ids, staffRole);

      const clubIds = clubs.map((club) => club.id);

      const sessions = await this.sessionService.getSessionsByUsers(ids, staffRole);

      const sessionIds = sessions.map((session) => session.id);

      const clubStudents = await this.clubStudentService.getClubStudentsByUsers(ids);

      const clubStudentIds = clubStudents.map((clubStudent) => clubStudent.id);

      const sessionParticipants =
        await this.sessionParticipantService.getSessionParticipantsByUsers(ids);

      const sessionParticipantIds = sessionParticipants.map(
        (sessionParticipant) => sessionParticipant.id,
      );

      const sessionSchedules =
        await this.sessionScheduleService.getSessionSchedulesByUsers(ids, staffRole);

      const sessionScheduleIds = sessionSchedules.map(
        (schedule) => schedule.id,
      );

      const sessionInstances =
        await this.sessionInstanceService.getSessionInstancesByUsers(ids, staffRole);

      const sessionInstanceIds = sessionInstances.map(
        (instance) => instance.id,
      );

      const attendances = await this.attendanceService.getAttendancesByUsers(ids);

      const deletedAttendances =
        attendances?.length > 0 && sessionInstanceIds.length > 0
          ? await this.attendanceService.removeAttendancesByInstances(
              sessionInstanceIds,
              transaction,
            )
          : false;

      const deletedSessionInstances =
        sessionInstanceIds.length > 0 && sessionScheduleIds.length > 0
          ? await this.sessionInstanceService.removeSessionInstancesBySchedules(
              sessionScheduleIds,
              transaction,
            )
          : false;

      const deletedSessionSchedules =
        sessionScheduleIds.length > 0 && sessionIds.length > 0
          ? await this.sessionScheduleService.removeSessionScheduleBySessions(
              sessionIds,
              transaction,
            )
          : false;

      const deletedSessionParticipants =
        sessionParticipantIds.length > 0 && clubStudentIds.length > 0
          ? await this.sessionParticipantService.removeSessionParticipantsByStudents(
              clubStudentIds,
              transaction,
            )
          : false;

      const deletedSessions =
        sessionIds.length > 0 && clubIds.length > 0
          ? await this.sessionService.removeSessionsByClubs(
              clubIds,
              transaction,
            )
          : false;

      const deletedClubStudents =
        clubStudentIds.length > 0 && clubIds.length > 0
          ? await this.clubStudentService.removeStudentsByClubs(
              clubIds,
              transaction,
            )
          : false;

      const deletedClubs =
        clubIds.length > 0
          ? await this.clubService.removeClubsByUsers(ids, transaction)
          : false;

      const deletedUsers = await this.usersRepository.removeUsers(ids, transaction);

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedAttendances} attendances, ${deletedSessionInstances} session instances, ${deletedSessionSchedules} session schedules, ${deletedSessionParticipants} session participants, ${deletedSessions} sessions, ${deletedClubStudents} club students for user IDs: ${ids}`,
      );

      return deletedUsers;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for user IDs: ${ids}`,
        error,
      );
      throw error;
    }
  }
}
