import {
  IsBoolean,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'The Auth0 user ID' })
  @IsString()
  auth0UserId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'phone must be a valid phone number' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRegistrationCompleted?: boolean;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;
}
