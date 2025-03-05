import { BadRequestException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { PaymentTargetRepository } from './payment-target.repository';
import { CreatePaymentTargetDto } from './dto/create-payment-target.dto';
import { UpdatePaymentTargetDto } from './dto/update-payment-target.dto';
import { PaymentTarget } from './entities/payment-target.entity';

@Injectable()
export class PaymentTargetService {
  constructor(
    private readonly paymentTargetsRepository: PaymentTargetRepository,
  ) {}

  async createPaymentTarget(
    createPaymentTargetDto: CreatePaymentTargetDto,
  ): Promise<PaymentTarget> {
    const paymentTarget = await this.paymentTargetsRepository.create(
      createPaymentTargetDto,
    );

    if (!paymentTarget) {
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }

    return paymentTarget;
  }

  async getPaymentTargets(): Promise<PaymentTarget[]> {
    const paymentTargets = await this.paymentTargetsRepository.findAll();

    if (!paymentTargets) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return paymentTargets;
  }

  async getPaymentTarget(id: UUID): Promise<PaymentTarget> {
    const paymentTarget = await this.paymentTargetsRepository.findOne(id);

    if (!paymentTarget) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return paymentTarget;
  }

  async updatePaymentTarget(
    id: UUID,
    updatePaymentTargetDto: UpdatePaymentTargetDto,
  ): Promise<PaymentTarget> {
    const isPaymentTargetUpdated = await this.paymentTargetsRepository.update(
      id,
      updatePaymentTargetDto,
    );

    if (!isPaymentTargetUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.paymentTargetsRepository.findOne(id);
  }

  async removePaymentTarget(id: UUID): Promise<boolean> {
    const isPaymentTargetRemoved =
      await this.paymentTargetsRepository.remove(id);

    if (!isPaymentTargetRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isPaymentTargetRemoved;
  }
}
