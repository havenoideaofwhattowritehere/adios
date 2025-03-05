import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionInstanceDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionScheduleId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  datetime: Date;

  @ApiProperty()
  @IsNumber()
  durationMinutes: number;

  @ApiProperty()
  @IsBoolean()
  isCanceled: boolean;
}
