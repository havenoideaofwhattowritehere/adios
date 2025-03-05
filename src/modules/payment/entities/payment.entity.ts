import {
  BelongsTo,
  BelongsToMany,
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

import { Session } from '../../../modules/session/entities/session.entity';
import { PaymentTarget } from '../../../modules/payment-target/entities/payment-target.entity';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IPayment } from '../../../shared/common/interfaces/models/payment.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> implements IPayment {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => ClubStudent)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  clubStudentId: string;

  @ApiProperty({ type: () => ClubStudent, example: {} })
  @BelongsTo(() => ClubStudent)
  clubStudent: ClubStudent;

  @ApiProperty()
  @Column(DataType.FLOAT)
  amount: number;

  @ApiProperty({ enum: () => PaymentMethod })
  @Column(DataType.ENUM('cash', 'card'))
  method: PaymentMethod;

  @ApiProperty({ type: () => Session, isArray: true, example: [{}] })
  @BelongsToMany(() => Session, () => PaymentTarget)
  sessions: Session[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const paymentProviders = [
  {
    provide: REPOSITORIES.PAYMENT,
    useValue: Payment,
    sequelize,
    modelName: 'Payment',
    hooks: {
      beforeCreate: (entity: Payment) => {
        entity.id = v4();
      },
    },
  },
];
