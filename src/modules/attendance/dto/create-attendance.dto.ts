import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  attended: boolean;

  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionInstanceId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionStudentId: string;
}
