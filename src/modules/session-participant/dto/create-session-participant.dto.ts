import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateSessionParticipantDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  clubStudentId: string;
}
