import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { StudentStatus } from '../entities/club-student.entity';
import { UUID } from '../../../shared/common/interfaces/types';

export class CreateClubStudentDto {
  @ApiProperty({
    description: 'The unique identifier of the club',
    example: 'b2f52f5e-d13f-4a67-8d8c-d9bcd86a6cfa',
  })
  @IsString()
  @IsUUID('4', { message: 'clubId must be a valid UUID (version 4)' })
  clubId: UUID;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'a67d4e3d-6ff3-4b91-9e22-f546b8e5f054',
  })
  @IsString()
  @IsUUID('4', { message: 'userId must be a valid UUID (version 4)' })
  userId: UUID;

  @ApiProperty({
    description: 'The status of the student within the club',
    enum: StudentStatus,
    example: StudentStatus.ACTIVE,
  })
  @IsEnum(StudentStatus, {
    message: 'Status must be a valid enum value (ACTIVE, INACTIVE)',
  })
  status: StudentStatus;
}
