import { PartialType } from '@nestjs/swagger';
import { CreateClubStaffDto } from './create-club-staff.dto';

export class UpdateClubStaffDto extends PartialType(CreateClubStaffDto) {}
