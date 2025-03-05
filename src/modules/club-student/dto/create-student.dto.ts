import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../../user/entities/user.entity';

export class CreateStudentDto {
  @ApiProperty({
    description: 'First name of the student',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the student',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Phone number of the student (Ukrainian format)',
    example: '+380977695551',
  })
  @IsPhoneNumber('UA', { message: 'phone must be a valid phone number' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Gender of the student',
    example: 'male',
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either Male or Female' })
  gender?: Gender = Gender.MALE;

  @ApiPropertyOptional({
    description: 'Birthday of the student in YYYY-MM-DD format',
    example: '2000-01-01',
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'Birthday must be in YYYY-MM-DD format' },
  )
  birthday?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Weight in kilograms',
    example: 70,
    minimum: 0,
    maximum: 300,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Height of the student in centimeters',
    example: 180,
    minimum: 0,
    maximum: 250,
  })
  @IsOptional()
  height?: number;
}
