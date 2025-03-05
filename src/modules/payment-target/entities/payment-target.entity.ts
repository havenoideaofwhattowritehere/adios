import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { Payment } from '../../../modules/payment/entities/payment.entity';
import { Session } from '../../../modules/session/entities/session.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IPaymentTarget } from '../../../shared/common/interfaces/models/payment.interface';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({ tableName: 'payment_targets' })
export class PaymentTarget
  extends Model<PaymentTarget>
  implements IPaymentTarget
{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => Payment)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  paymentId: string;

  @ApiProperty({ type: () => Payment, example: {} })
  @BelongsTo(() => Payment)
  payment: Payment;

  @ApiProperty()
  @ForeignKey(() => Session)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  sessionId: string;

  @ApiProperty({ type: () => Session, example: {} })
  @BelongsTo(() => Session)
  session: Session;

  @ApiProperty()
  @Column(DataType.DATE)
  month: Date;

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const paymentTargetProviders = [
  {
    provide: REPOSITORIES.PAYMENT_TARGET,
    useValue: PaymentTarget,
    sequelize,
    modelName: 'PaymentTarget',
    hooks: {
      beforeCreate: (entity: PaymentTarget) => {
        entity.id = v4();
      },
    },
  },
];
