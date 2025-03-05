import { Test, TestingModule } from '@nestjs/testing';

import { PaymentController } from '../../src/modules/payment/payment.controller';
import { PaymentModule } from '../../src/modules/payment/payment.module';
import { PaymentService } from '../../src/modules/payment/payment.service';

describe('PaymentModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have Payment components', async () => {
    expect(module.get(PaymentController)).toBeInstanceOf(PaymentController);
    expect(module.get(PaymentService)).toBeInstanceOf(PaymentService);
  });
});
