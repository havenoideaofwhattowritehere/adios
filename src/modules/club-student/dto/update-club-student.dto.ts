import { PartialType } from '@nestjs/swagger';
import { CreateClubStudentDto } from './create-club-student.dto';

export class UpdateClubStudentDto extends PartialType(CreateClubStudentDto) {}
