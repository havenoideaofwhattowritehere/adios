import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentsRepository: PaymentRepository) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = await this.paymentsRepository.create(createPaymentDto);

    if (!payment) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return payment;
  }

  async getPayments(): Promise<Payment[]> {
    const payments = await this.paymentsRepository.findAll();

    if (!payments) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return payments;
  }

  async getPayment(id: UUID): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne(id);

    if (!payment) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return payment;
  }

  async updatePayment(
    id: UUID,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const isPaymentUpdated = await this.paymentsRepository.update(
      id,
      updatePaymentDto,
    );

    if (!isPaymentUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.paymentsRepository.findOne(id);
  }

  async removePayment(id: UUID): Promise<boolean> {
    const isPaymentRemoved = await this.paymentsRepository.remove(id);

    if (!isPaymentRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isPaymentRemoved;
  }
}
