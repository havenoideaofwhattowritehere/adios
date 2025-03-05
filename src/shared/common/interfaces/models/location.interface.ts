import { Club } from '../../../../modules/club/entities/club.entity';
import { Session } from '../../../../modules/session/entities/session.entity';
import { SessionInstance } from '../../../../modules/session-instance/entities/session-instance.entity';
import { UUID } from '../types';

export interface ILocation {
  id: UUID;
  clubId: string;
  club: Club;
  name: string;
  maxPeople: number;
  lat: number;
  lng: number;
  gMapName: string;
  sessions: Session[];
  createdAt: Date;
  updatedAt: Date;
}
