import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { SessionScheduleType } from '../entities/session-schedule.entity';
import { Type } from 'class-transformer';

export class CreateSessionScheduleDto {
  @ApiProperty({ enum: SessionScheduleType })
  @IsEnum(SessionScheduleType, { message: 'Valid type required' })
  type: SessionScheduleType;

  @ApiProperty()
  @IsNumber()
  durationMinutes: number;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  sessionId: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === SessionScheduleType.ONCE)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'Once date is required for ONCE sessions' })
  onceDate: Date;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type !== SessionScheduleType.ONCE)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'Start date is required for WEEKLY sessions' })
  startDate: Date;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type !== SessionScheduleType.ONCE)
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'End date is required for WEEKLY sessions' })
  endDate: Date;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type !== SessionScheduleType.ONCE)
  @IsString()
  @IsNotEmpty({ message: 'Day of week mask is required for weekly sessions' })
  dayOfWeekMask: string;
}
