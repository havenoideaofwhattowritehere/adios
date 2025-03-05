import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  clubStudentId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod, { message: 'Valid method required' })
  method: PaymentMethod;
}
