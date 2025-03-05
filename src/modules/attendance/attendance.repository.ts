import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { UUID } from '../../shared/common/interfaces/types';
import { REPOSITORIES } from '../../shared/helpers/repositories';
import { ATTENDANCE_INCLUDE } from './entities/attendance.include';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(REPOSITORIES.ATTENDANCE)
    private attendanceRepository: typeof Attendance,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceRepository.create<Attendance>(
      {
        ...createAttendanceDto,
      },
      { include: ATTENDANCE_INCLUDE.create() },
    );
  }

  async bulkCreate(
    payload: CreateAttendanceDto[],
    transaction: Transaction,
  ): Promise<Attendance[]> {
    return this.attendanceRepository.bulkCreate(payload, {
      transaction,
      include: ATTENDANCE_INCLUDE.create(),
    });
  }

  async findAll(clubId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      include: ATTENDANCE_INCLUDE.getAllByClub(clubId),
    });
  }

  async findAllByStudent(studentId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      include: ATTENDANCE_INCLUDE.getAllByStudent(studentId),
    });
  }

  async findAllBySession(sessionId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      include: ATTENDANCE_INCLUDE.getAllBySession(sessionId),
    });
  }

  async findAllByUsers(userIds: UUID[]): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      include: ATTENDANCE_INCLUDE.getAllByUsers(userIds),
    });
  }

  async findAllBySchedule(scheduleId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      include: ATTENDANCE_INCLUDE.getAllBySchedule(scheduleId),
    });
  }

  async findAllByInstance(instanceId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      where: { sessionInstanceId: instanceId },
      include: ATTENDANCE_INCLUDE.getAll(),
    });
  }

  async findAllByParticipant(participantId: UUID): Promise<Attendance[]> {
    return this.attendanceRepository.findAll({
      where: { sessionStudentId: participantId },
      include: ATTENDANCE_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<Attendance> {
    return this.attendanceRepository.findOne({
      where: { id },
      include: ATTENDANCE_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<boolean> {
    const attendance = await this.attendanceRepository.update(
      updateAttendanceDto,
      { where: { id } },
    );
    return Boolean(attendance[0]);
  }

  async remove(id: UUID): Promise<boolean> {
    const attendance = await this.attendanceRepository.destroy({
      where: { id },
    });
    return Boolean(attendance);
  }

  async removeByInstanceId(instanceId: UUID): Promise<number> {
    return this.attendanceRepository.destroy({
      where: {
        sessionInstanceId: instanceId,
      },
    });
  }

  async removeByInstanceIds(
    instanceIds: UUID[],
    transaction: Transaction,
  ): Promise<number> {
    return this.attendanceRepository.destroy({
      where: {
        sessionInstanceId: instanceIds,
      },
      transaction,
    });
  }

  async removeByParticipantIds(
    participantIds: UUID[],
    transaction: Transaction,
  ): Promise<number> {
    return this.attendanceRepository.destroy({
      where: {
        sessionStudentId: participantIds,
      },
      transaction,
    });
  }
}
