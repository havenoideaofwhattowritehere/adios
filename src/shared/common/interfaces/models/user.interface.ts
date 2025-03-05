import { StaffStatus } from '../../../../modules/club-staff/entities/club-staff.entity';
import { StudentStatus } from '../../../../modules/club-student/entities/club-student.entity';
import { Club } from '../../../../modules/club/entities/club.entity';
import { Payment } from '../../../../modules/payment/entities/payment.entity';
import { SessionInstance } from '../../../../modules/session-instance/entities/session-instance.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { Gender, User } from '../../../../modules/user/entities/user.entity';
import { UUID } from '../types';

export interface IUser {
  id: UUID;
  auth0UserId: string;
  firstName: string;
  lastName: string;
  phone: string;
  isRegistrationCompleted: boolean;
  gender: Gender;
  birthday: Date;
  weight: number;
  height: number;
  clubsAsStaff: Club[];
  clubsAsStudent: Club[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IClubStaff {
  id: UUID;
  clubId: string;
  club: Club;
  userId: string;
  user: User;
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClubStudent {
  id: UUID;
  clubId: string;
  club: Club;
  userId: string;
  user: User;
  status: StudentStatus;
  payments: Payment[];
  sessions: Session[];
  sessionInstances: SessionInstance[];
  createdAt: Date;
  updatedAt: Date;
}
