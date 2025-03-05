import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { REPOSITORIES } from '../../shared/helpers/repositories';
import { PAYMENT_INCLUDE } from './entities/payment.include';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @Inject(REPOSITORIES.PAYMENT) private paymentsRepository: typeof Payment,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsRepository.create<Payment>(
      { ...createPaymentDto },
      { include: PAYMENT_INCLUDE.create() },
    );
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll({
      include: PAYMENT_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<Payment> {
    return this.paymentsRepository.findOne({
      where: { id },
      include: PAYMENT_INCLUDE.getOne(),
    });
  }

  async update(id: UUID, updatePaymentDto: UpdatePaymentDto): Promise<boolean> {
    const payment = await this.paymentsRepository.update(updatePaymentDto, {
      where: { id },
    });
    return Boolean(payment[0]);
  }

  async remove(id: UUID): Promise<boolean> {
    const payment = await this.paymentsRepository.destroy({ where: { id } });
    return Boolean(payment);
  }
}
