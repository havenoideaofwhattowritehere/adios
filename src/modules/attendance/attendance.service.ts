import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async createAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const attendance =
      await this.attendanceRepository.create(createAttendanceDto);

    if (!attendance) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return attendance;
  }

  async createAttendances(
    createAttendanceDtos: CreateAttendanceDto[],
    transaction: Transaction,
  ): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.bulkCreate(
      createAttendanceDtos,
      transaction,
    );

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return attendances;
  }

  async getAttendances(clubId: UUID): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.findAll(clubId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesByStudent(studentId: UUID): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllByStudent(studentId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesBySession(sessionId: UUID): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllBySession(sessionId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesByUsers(userIds: UUID[]): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllByUsers(userIds);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesBySchedule(scheduleId: UUID): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllBySchedule(scheduleId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesByInstance(instanceId: UUID): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllByInstance(instanceId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendancesByParticipant(participantId: UUID): Promise<Attendance[]> {
    const attendances =
      await this.attendanceRepository.findAllByParticipant(participantId);

    if (!attendances) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendances;
  }

  async getAttendance(id: UUID): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne(id);

    if (!attendance) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return attendance;
  }

  async updateAttendance(
    id: UUID,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const isAttendanceUpdated = await this.attendanceRepository.update(
      id,
      updateAttendanceDto,
    );

    if (!isAttendanceUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.attendanceRepository.findOne(id);
  }

  async removeAttendance(id: UUID): Promise<boolean> {
    const isAttendanceRemoved = await this.attendanceRepository.remove(id);

    if (!isAttendanceRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isAttendanceRemoved;
  }

  async removeAttendancesByInstance(instanceId: UUID): Promise<void> {
    const removedAttendances =
      await this.attendanceRepository.removeByInstanceId(instanceId);
    if (!removedAttendances) {
      this.logger.warn(
        `No session instances found for instance ID: ${instanceId}`,
      );
    } else {
      this.logger.log(
        `Removed ${removedAttendances} session instances for instance ID: ${instanceId}`,
      );
    }
  }

  async removeAttendancesByInstances(
    instanceIds: UUID[],
    transaction: Transaction,
  ): Promise<void> {
    const removedAttendances =
      await this.attendanceRepository.removeByInstanceIds(
        instanceIds,
        transaction,
      );
    if (!removedAttendances) {
      this.logger.warn(
        `No attendances found for instance ID: ${instanceIds}`,
      );
    } else {
      this.logger.log(
        `Removed ${removedAttendances} attendances for instance ID: ${instanceIds}`,
      );
    }
  }

  async removeAttendancesByParticipants(
    participantIds: UUID[],
    transaction: Transaction,
  ): Promise<void> {
    const removedAttendances =
      await this.attendanceRepository.removeByParticipantIds(
        participantIds,
        transaction,
      );
    if (!removedAttendances) {
      this.logger.warn(
        `No attendances found for participant ID: ${participantIds}`,
      );
    } else {
      this.logger.log(
        `Removed ${removedAttendances} attendances for participant ID: ${participantIds}`,
      );
    }
  }
}
