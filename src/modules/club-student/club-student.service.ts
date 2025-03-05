import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';
import { v4 } from 'uuid';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { ClubStudentRepository } from './club-student.repository';
import { CreateClubStudentDto } from './dto/create-club-student.dto';
import { UpdateClubStudentDto } from './dto/update-club-student.dto';
import { AuthRegisterBotDto } from '../../core/auth/dto/create-auth-register-bot.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ClubStudent, StudentStatus } from './entities/club-student.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from '../../core/auth/auth.service';
import { SessionParticipantService } from '../session-participant/session-participant.service';
import { SearchClubStudentsDto } from './dto/search-club-student.dto';
import { GetUserByPhoneDto } from './dto/get-user-by-phone.dto';
import { ClubStaffService } from '../club-staff/club-staff.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class ClubStudentService {
  private readonly logger = new Logger(ClubStudentService.name);

  constructor(
    private readonly clubStudentsRepository: ClubStudentRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly clubStaffService: ClubStaffService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly sessionParticipantService: SessionParticipantService,
    private readonly attendanceService: AttendanceService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createClubStudent(
    payload: CreateClubStudentDto,
    transaction?: Transaction,
  ): Promise<ClubStudent> {
    const clubStudent = await this.clubStudentsRepository.create(
      payload,
      transaction,
    );

    return clubStudent;
  }

  async registerStudent(
    payload: CreateStudentDto,
    clubId: UUID,
  ): Promise<ClubStudent> {
    const phone = payload.phone;

    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const isPhoneValid = await this.userService.isPhoneValid(phone);
      if (!isPhoneValid) {
        throw new BadRequestException(ErrorMap.USER_WITH_PHONE_ALREADY_EXISTS);
      }
      const nameBot = payload.phone;
      const lastName = payload.lastName;
      const firstName = payload.firstName;
      const createUserPayload: AuthRegisterBotDto = {
        lastName,
        firstName,
        phone,
        nameBot,
      };
      const auth0UserId =
        await this.authService.createUserInAuth0(createUserPayload);
      // const roles = [UserRole.client];
      // await this.authService.addRolesToUser(auth0UserId, roles);
      const user = await this.authService.createInternalUserWithAuth0(
        auth0UserId,
        { ...payload },
        transaction,
      );

      const clubStudent = await this.assignStudentToClub(
        user.id,
        clubId,
        transaction,
      );
      await transaction.commit();

      return this.getClubStudent(clubStudent.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async registerStudentViaBot(
    payload: CreateStudentDto,
    clubId: UUID,
  ): Promise<User> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const existUser = await this.userService.findUserByPhone(payload.phone);
      if (existUser) {
        await transaction.commit();
        return existUser;
      }

      const user = await this.userService.createUser(
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          auth0UserId: v4(),
        },
        transaction,
      );
      await this.assignStudentToClub(user.id, clubId, transaction);
      await transaction.commit();

      return this.userService.getUser(user.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async assignStudentToClub(
    userId: UUID,
    clubId: UUID,
    transaction: Transaction,
  ): Promise<ClubStudent> {
    const createClubStudentfPayload: CreateClubStudentDto = {
      clubId,
      userId,
      status: StudentStatus.ACTIVE,
    };
    return this.createClubStudent(createClubStudentfPayload, transaction);
  }

  async getClubStudents(
    clubId: string,
    payload?: SearchClubStudentsDto,
  ): Promise<ClubStudent[]> {
    const clubStudent = payload
      ? await this.clubStudentsRepository.findAllWithQuery(clubId, payload)
      : await this.clubStudentsRepository.findAll(clubId);

    if (!clubStudent) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudent;
  }

  async getClubStudentsByUser(userId: string): Promise<ClubStudent[]> {
    const clubStudent = await this.clubStudentsRepository.findAllByUser(userId);

    if (!clubStudent) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudent;
  }

  async getClubStudentsByUsers(userIds: string[]): Promise<ClubStudent[]> {
    const clubStudent = await this.clubStudentsRepository.findAllByUsers(userIds);

    if (!clubStudent) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudent;
  }

  async getClubStudent(id: UUID): Promise<ClubStudent> {
    const clubStudent = await this.clubStudentsRepository.findOne(id);

    if (!clubStudent) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudent;
  }

  async getStudents(clubId: UUID): Promise<User[]> {
    const clubStudents = await this.clubStudentsRepository.findAll(clubId);

    if (!clubStudents) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return clubStudents.map((cs) => cs.user);
  }

  async getStudent(id: UUID): Promise<User> {
    return this.userService.getUser(id);
  }

  async getUserByPhone(
    clubId: UUID,
    phone: string,
  ): Promise<GetUserByPhoneDto> {
    const user = await this.userService.findUserByPhone(phone);
    const isExist = !!user;
    const isInClubAsStudent =
      isExist && (await this.getClubStudentByRecord(user.id, clubId));
    const isInClubAsStaff =
      isExist &&
      (await this.clubStaffService.getClubStaffByRecord(user.id, clubId));
    const isInClub = !!(isInClubAsStudent || isInClubAsStaff);
    return {
      isExist,
      isInClub,
      user,
    };
  }

  async getClubStudentByRecord(
    userId: UUID,
    clubId: UUID,
  ): Promise<ClubStudent> {
    return this.clubStudentsRepository.findByRecord(userId, clubId);
  }

  async updateClubStudent(
    id: UUID,
    updateClubStudentDto: UpdateClubStudentDto,
  ): Promise<ClubStudent> {
    const isClubStudentUpdated = await this.clubStudentsRepository.update(
      id,
      updateClubStudentDto,
    );

    if (!isClubStudentUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.clubStudentsRepository.findOne(id);
  }

  async updateStudent(
    id: UUID,
    updateStudentDto: UpdateStudentDto,
  ): Promise<ClubStudent> {
    const clubStudent = await this.getClubStudent(id);
    await this.userService.updateUser(clubStudent.userId, updateStudentDto);
    return clubStudent;
  }

  async removeClubStudent(id: UUID): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const sessionParticipants =
        await this.sessionParticipantService.getSessionParticipantsByStudent(
          id,
        );

      const sessionParticipantIds = sessionParticipants.map((sp) => sp.id);

      const attendances =
        await this.attendanceService.getAttendancesByStudent(id);

      const deletedAttendances =
        attendances?.length > 0
          ? await this.attendanceService.removeAttendancesByParticipants(
              sessionParticipantIds,
              transaction,
            )
          : false;

      const deletedSessionParticipants =
        sessionParticipantIds.length > 0
          ? await this.sessionParticipantService.removeSessionParticipantsByStudents(
              [id],
              transaction,
            )
          : false;

      const isClubStudentRemoved = await this.clubStudentsRepository.remove(
        id,
        transaction,
      );

      await transaction.commit();

      this.logger.log(
        `Deleted ${deletedSessionParticipants} session participants, ${deletedAttendances} attendances for student ID: ${id}`,
      );

      return isClubStudentRemoved;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to bulk remove data for student ID: ${id}`,
        error,
      );
      throw error;
    }
  }

  async removeStudentsByClubs(
    clubIds: UUID[],
    transaction?: Transaction,
  ): Promise<boolean> {
    const isStudentRemoved = await this.clubStudentsRepository.removeByClubs(
      clubIds,
      transaction,
    );

    if (!isStudentRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isStudentRemoved;
  }

  async removeStudent(userId: UUID): Promise<boolean> {
    const isClubStudentRemoved =
      await this.clubStudentsRepository.removeByUser(userId);

    if (!isClubStudentRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return this.userService.removeUsers([userId]);
  }

  async removeStudentsByUser(
    userId: UUID,
    transaction?: Transaction,
  ): Promise<boolean> {
    const isClubStudentRemoved = await this.clubStudentsRepository.removeByUser(
      userId,
      transaction,
    );

    if (!isClubStudentRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isClubStudentRemoved;
  }
}
