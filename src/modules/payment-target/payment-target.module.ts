import { Module } from '@nestjs/common';

import { PaymentTargetService } from './payment-target.service';
import { PaymentTargetController } from './payment-target.controller';
import { PaymentTargetRepository } from './payment-target.repository';
import { paymentTargetProviders } from './entities/payment-target.entity';

@Module({
  controllers: [PaymentTargetController],
  providers: [
    PaymentTargetService,
    PaymentTargetRepository,
    ...paymentTargetProviders,
  ],
  exports: [PaymentTargetService],
})
export class PaymentTargetModule {}
