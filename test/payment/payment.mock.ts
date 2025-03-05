import { v4 } from 'uuid';
import { CreatePaymentDto } from '../../src/modules/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../src/modules/payment/dto/update-payment.dto';
import { PaymentMethod } from '../../src/modules/payment/entities/payment.entity';

export const mockPaymentCreate: CreatePaymentDto = {
  clubStudentId: v4(),
  amount: Math.random(),
  method: PaymentMethod.CARD,
};

export const mockPaymentUpdate: UpdatePaymentDto = {
  amount: Math.random(),
  method: PaymentMethod.CASH,
};

export const mockPaymentService = {
  createPayment: jest.fn(),
  getPayments: jest.fn(),
  getPayment: jest.fn(),
  updatePayment: jest.fn(),
  removePayment: jest.fn(),
};
