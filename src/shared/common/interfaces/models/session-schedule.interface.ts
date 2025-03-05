import { SessionInstance } from '../../../../modules/session-instance/entities/session-instance.entity';
import { SessionScheduleType } from '../../../../modules/session-schedule/entities/session-schedule.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { UUID } from '../types';

export interface ISessionSchedule {
  id: UUID;
  sessionId: string;
  type: SessionScheduleType;
  durationMinutes: number;
  time: string;
  onceDate?: Date;
  startDate?: Date;
  endDate?: Date;
  dayOfWeekMask?: string;
  session: Session;
  sessionInstances: SessionInstance[];
  createdAt: Date;
  updatedAt: Date;
}
