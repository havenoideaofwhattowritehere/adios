import { Test, TestingModule } from '@nestjs/testing';

import { PaymentTargetController } from '../../src/modules/payment-target/payment-target.controller';
import { PaymentTargetModule } from '../../src/modules/payment-target/payment-target.module';
import { PaymentTargetService } from '../../src/modules/payment-target/payment-target.service';

describe('PaymentTargetModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentTargetModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have PaymentTarget components', async () => {
    expect(module.get(PaymentTargetController)).toBeInstanceOf(
      PaymentTargetController,
    );
    expect(module.get(PaymentTargetService)).toBeInstanceOf(
      PaymentTargetService,
    );
  });
});
