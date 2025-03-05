import { Location } from '../../../../modules/location/entities/location.entity';
import { ClubStudent } from '../../../../modules/club-student/entities/club-student.entity';
import { Club } from '../../../../modules/club/entities/club.entity';
import { Payment } from '../../../../modules/payment/entities/payment.entity';
import { SessionParticipant } from '../../../../modules/session-participant/entities/session-participant.entity';
import { SessionSchedule } from '../../../../modules/session-schedule/entities/session-schedule.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { UUID } from '../types';

export interface ISession {
  id: UUID;
  clubId: string;
  club: Club;
  locationId: string;
  location: Location;
  name: string;
  defaultDurationInMinutes: number;
  price: number;
  maxPeople: number;
  sessionSchedules: SessionSchedule[];
  sessionParticipants: SessionParticipant[];
  clubStudents: ClubStudent[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionParticipant {
  id: UUID;
  sessionId: string;
  clubStudentId: string;
  session: Session;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClubStudentSession {
  id: UUID;
  clubStudentId: string;
  clubStudent: ClubStudent;
  sessionId: string;
  session: Session;
  createdAt: Date;
  updatedAt: Date;
}
