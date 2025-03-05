import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  Payment,
  paymentProviders,
} from '../../src/modules/payment/entities/payment.entity';
import { PaymentController } from '../../src/modules/payment/payment.controller';
import { PaymentService } from '../../src/modules/payment/payment.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { PaymentRepository } from '../../src/modules/payment/payment.repository';
import {
  mockPaymentCreate,
  mockPaymentService,
  mockPaymentUpdate,
} from './payment.mock';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PaymentController],
      providers: [PaymentService, PaymentRepository, ...paymentProviders],
    })
      .overrideProvider(PaymentService)
      .useValue(mockPaymentService)
      .compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createPayment', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createPayment')
        .mockImplementation(async () => new Payment());
    });

    it('should be defined', () => {
      expect(service.createPayment).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createPayment(mockPaymentCreate);
      expect(service.createPayment).toBeCalledTimes(1);
    });

    it('should return created payment', async () => {
      const result = await controller.createPayment(mockPaymentCreate);
      id = result.id as UUID;
      expect(result).toBeInstanceOf(Payment);
    });
  });

  describe('#getPayments', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getPayments').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getPayments).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getPayments();
      expect(service.getPayments).toBeCalledTimes(1);
    });

    it('should return all payments', async () => {
      const result = await controller.getPayments();
      expect(result).toEqual([]);
    });
  });

  describe('#getPayment', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getPayment')
        .mockImplementation(async () => new Payment());
    });

    it('should be defined', () => {
      expect(service.getPayment).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getPayment(id);
      expect(service.getPayment).toBeCalledTimes(1);
    });

    it('should return payment', async () => {
      const result = await controller.getPayment(id);
      expect(result).toBeInstanceOf(Payment);
    });
  });

  describe('#updatePayment', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updatePayment')
        .mockImplementation(async () => new Payment());
    });

    it('should be defined', () => {
      expect(service.updatePayment).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updatePayment(id, mockPaymentUpdate);
      expect(service.updatePayment).toBeCalledTimes(1);
    });

    it('should return updated payment', async () => {
      const result = await controller.updatePayment(id, mockPaymentUpdate);
      expect(result).toBeInstanceOf(Payment);
    });
  });

  describe('#removePayment', () => {
    beforeEach(() => {
      jest.spyOn(service, 'removePayment').mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removePayment).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removePayment(id);
      expect(service.removePayment).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removePayment(id);
      expect(result).toBeTruthy();
    });
  });
});
