import { PartialType } from '@nestjs/swagger';
import { CreateClubStudentSessionInstanceDto } from './create-club-student-session-instance.dto';

export class UpdateClubStudentSessionInstanceDto extends PartialType(
  CreateClubStudentSessionInstanceDto,
) {}
