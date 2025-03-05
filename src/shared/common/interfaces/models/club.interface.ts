import { Location } from '../../../../modules/location/entities/location.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { SessionInstance } from '../../../../modules/session-instance/entities/session-instance.entity';
import { User } from '../../../../modules/user/entities/user.entity';
import { UUID } from '../types';

export interface IClub {
  id: UUID;
  name: string;
  staff: User[];
  students: User[];
  sessions: Session[];
  locations: Location[];
  createdAt: Date;
  updatedAt: Date;
}
