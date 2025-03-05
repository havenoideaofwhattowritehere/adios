import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePaymentTargetDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsUUID()
  @IsOptional()
  sessionId: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  month: Date;
}
