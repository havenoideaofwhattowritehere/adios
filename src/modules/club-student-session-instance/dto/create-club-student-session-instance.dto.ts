import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateClubStudentSessionInstanceDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  clubStudentId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionInstanceId: string;
}
