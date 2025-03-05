import { PartialType } from '@nestjs/swagger';
import { CreateClubStudentSessionDto } from './create-club-student-session.dto';

export class UpdateClubStudentSessionDto extends PartialType(
  CreateClubStudentSessionDto,
) {}
