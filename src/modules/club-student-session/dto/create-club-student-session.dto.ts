import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateClubStudentSessionDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  clubStudentId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionId: string;
}
