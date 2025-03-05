import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { SessionType } from '../entities/session.entity';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  locationId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: SessionType })
  @IsEnum(SessionType, { message: 'Valid type required' })
  type: SessionType;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Duration must be a positive number' })
  defaultDurationInMinutes: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Max people must be a positive number' })
  maxPeople: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  participantIds?: [string];
}
