import { ClubStudent } from '../../../../modules/club-student/entities/club-student.entity';
import {
  Payment,
  PaymentMethod,
} from '../../../../modules/payment/entities/payment.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { UUID } from '../types';

export interface IPayment {
  id: UUID;
  clubStudentId: string;
  clubStudent: ClubStudent;
  amount: number;
  method: PaymentMethod;
  sessions: Session[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentTarget {
  id: UUID;
  paymentId: string;
  payment: Payment;
  sessionId: string;
  session: Session;
  month: Date;
  createdAt: Date;
  updatedAt: Date;
}
