import { PartialType } from '@nestjs/swagger';
import { CreatePaymentTargetDto } from './create-payment-target.dto';

export class UpdatePaymentTargetDto extends PartialType(
  CreatePaymentTargetDto,
) {}
