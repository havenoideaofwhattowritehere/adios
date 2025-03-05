import { ClubStudent } from '../../../../modules/club-student/entities/club-student.entity';
import { Attendance } from '../../../../modules/attendance/entities/attendance.entity';
import { SessionInstance } from '../../../../modules/session-instance/entities/session-instance.entity';
import { SessionSchedule } from '../../../../modules/session-schedule/entities/session-schedule.entity';
import { SessionParticipant } from '../../../../modules/session-participant/entities/session-participant.entity';
import { UUID } from '../types';

export interface ISessionInstance {
  id: UUID;
  sessionScheduleId: string;
  sessionSchedule: SessionSchedule;
  datetime: Date;
  durationMinutes: number;
  isCanceled: boolean;
  attendances: Attendance[];
  participants: ClubStudent[];
}

export interface IAttendance {
  id: UUID;
  sessionInstanceId: string;
  sessionStudentId: string;
  attended: boolean;
  sessionInstance: SessionInstance;
  sessionParticipant: SessionParticipant;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IClubStudentSessionInstance {
  id: string;
  clubStudentId: string;
  clubStudent: ClubStudent;
  sessionInstanceId: string;
  sessionInstance: SessionInstance;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
