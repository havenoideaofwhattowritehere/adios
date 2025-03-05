import { UUID } from '../../../shared/common/interfaces/types';
import { Location } from '../../location/entities/location.entity';

export class GetSessionInstanceDto {
  id: UUID;
  title: string;
  location: Location;
  people: PersonDto[];
  start: Date;
  end: Date;
}

class PersonDto {
  studentId: UUID;
  firstName: string;
  lastName: string;
  attended: boolean;
}
