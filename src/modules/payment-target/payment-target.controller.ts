import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';

import { PaymentTargetService } from './payment-target.service';
import { CreatePaymentTargetDto } from './dto/create-payment-target.dto';
import { UpdatePaymentTargetDto } from './dto/update-payment-target.dto';
import { PaymentTarget } from './entities/payment-target.entity';

@ApiTags('Payment Target')
@Controller('paymentTarget')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiSecurity('club-id-header')
export class PaymentTargetController {
  constructor(private readonly paymentTargetService: PaymentTargetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: () => PaymentTarget })
  async createPaymentTarget(
    @Body() createPaymentTargetDto: CreatePaymentTargetDto,
  ): Promise<PaymentTarget> {
    return this.paymentTargetService.createPaymentTarget(
      createPaymentTargetDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => PaymentTarget, isArray: true })
  async getPaymentTargets(): Promise<PaymentTarget[]> {
    return this.paymentTargetService.getPaymentTargets();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => PaymentTarget })
  async getPaymentTarget(@Param('id') id: UUID): Promise<PaymentTarget> {
    return this.paymentTargetService.getPaymentTarget(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => PaymentTarget })
  async updatePaymentTarget(
    @Param('id') id: UUID,
    @Body() updatePaymentTargetDto: UpdatePaymentTargetDto,
  ): Promise<PaymentTarget> {
    return this.paymentTargetService.updatePaymentTarget(
      id,
      updatePaymentTargetDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Boolean })
  async removePaymentTarget(@Param('id') id: UUID): Promise<boolean> {
    return this.paymentTargetService.removePaymentTarget(id);
  }
}
