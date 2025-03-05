import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  PaymentTarget,
  paymentTargetProviders,
} from '../../src/modules/payment-target/entities/payment-target.entity';
import { PaymentTargetController } from '../../src/modules/payment-target/payment-target.controller';
import { PaymentTargetService } from '../../src/modules/payment-target/payment-target.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { PaymentTargetRepository } from '../../src/modules/payment-target/payment-target.repository';
import {
  mockPaymentTargetCreate,
  mockPaymentTargetService,
  mockPaymentTargetUpdate,
} from './payment-target.mock';

describe('PaymentTargetController', () => {
  let controller: PaymentTargetController;
  let service: PaymentTargetService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PaymentTargetController],
      providers: [
        PaymentTargetService,
        PaymentTargetRepository,
        ...paymentTargetProviders,
      ],
    })
      .overrideProvider(PaymentTargetService)
      .useValue(mockPaymentTargetService)
      .compile();

    controller = module.get<PaymentTargetController>(PaymentTargetController);
    service = module.get<PaymentTargetService>(PaymentTargetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createPaymentTarget', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createPaymentTarget')
        .mockImplementation(async () => new PaymentTarget());
    });

    it('should be defined', () => {
      expect(service.createPaymentTarget).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createPaymentTarget(mockPaymentTargetCreate);
      expect(service.createPaymentTarget).toBeCalledTimes(1);
    });

    it('should return created paymentTarget', async () => {
      const result = await controller.createPaymentTarget(
        mockPaymentTargetCreate,
      );
      id = result.id as UUID;
      expect(result).toBeInstanceOf(PaymentTarget);
    });
  });

  describe('#getPaymentTargets', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getPaymentTargets')
        .mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getPaymentTargets).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getPaymentTargets();
      expect(service.getPaymentTargets).toBeCalledTimes(1);
    });

    it('should return all paymentTargets', async () => {
      const result = await controller.getPaymentTargets();
      expect(result).toEqual([]);
    });
  });

  describe('#getPaymentTarget', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getPaymentTarget')
        .mockImplementation(async () => new PaymentTarget());
    });

    it('should be defined', () => {
      expect(service.getPaymentTarget).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getPaymentTarget(id);
      expect(service.getPaymentTarget).toBeCalledTimes(1);
    });

    it('should return paymentTarget', async () => {
      const result = await controller.getPaymentTarget(id);
      expect(result).toBeInstanceOf(PaymentTarget);
    });
  });

  describe('#updatePaymentTarget', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updatePaymentTarget')
        .mockImplementation(async () => new PaymentTarget());
    });

    it('should be defined', () => {
      expect(service.updatePaymentTarget).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updatePaymentTarget(id, mockPaymentTargetUpdate);
      expect(service.updatePaymentTarget).toBeCalledTimes(1);
    });

    it('should return updated paymentTarget', async () => {
      const result = await controller.updatePaymentTarget(
        id,
        mockPaymentTargetUpdate,
      );
      expect(result).toBeInstanceOf(PaymentTarget);
    });
  });

  describe('#removePaymentTarget', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removePaymentTarget')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removePaymentTarget).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removePaymentTarget(id);
      expect(service.removePaymentTarget).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removePaymentTarget(id);
      expect(result).toBeTruthy();
    });
  });
});
