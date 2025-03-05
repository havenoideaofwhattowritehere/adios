import { Module } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { paymentProviders } from './entities/payment.entity';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, ...paymentProviders],
  exports: [PaymentService],
})
export class PaymentModule {}
