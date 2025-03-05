import { v4 } from 'uuid';
import { CreatePaymentTargetDto } from '../../src/modules/payment-target/dto/create-payment-target.dto';
import { UpdatePaymentTargetDto } from '../../src/modules/payment-target/dto/update-payment-target.dto';

export const mockPaymentTargetCreate: CreatePaymentTargetDto = {
  paymentId: v4(),
  sessionId: v4(),
  month: new Date(),
};

export const mockPaymentTargetUpdate: UpdatePaymentTargetDto = {
  month: new Date(),
};

export const mockPaymentTargetService = {
  createPaymentTarget: jest.fn(),
  getPaymentTargets: jest.fn(),
  getPaymentTarget: jest.fn(),
  updatePaymentTarget: jest.fn(),
  removePaymentTarget: jest.fn(),
};
