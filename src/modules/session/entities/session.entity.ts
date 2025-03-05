import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  ForeignKey,
  HasMany,
  Default,
  UpdatedAt,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { SessionSchedule } from '../../session-schedule/entities/session-schedule.entity';
import { SessionParticipant } from '../../session-participant/entities/session-participant.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { Club } from '../../../modules/club/entities/club.entity';
import { Location } from '../../../modules/location/entities/location.entity';
import { ClubStudentSession } from '../../../modules/club-student-session/entities/club-student-session.entity';
import { PaymentTarget } from '../../../modules/payment-target/entities/payment-target.entity';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { Payment } from '../../../modules/payment/entities/payment.entity';
import { ISession } from '../../../shared/common/interfaces/models/session.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum SessionType {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
}

@Table({ tableName: 'sessions' })
export class Session extends Model<Session> implements ISession {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => Club)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  clubId: string;

  @ApiProperty({ type: () => Club, example: {} })
  @BelongsTo(() => Club)
  club: Club;

  @ApiProperty()
  @ForeignKey(() => Location)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  locationId: string;

  @ApiProperty({ type: () => Location, example: {} })
  @BelongsTo(() => Location)
  location: Location;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ enum: () => SessionType })
  @Column(DataType.ENUM('group', 'individual'))
  type: SessionType;

  @ApiProperty()
  @Default(30)
  @Column(DataType.INTEGER)
  defaultDurationInMinutes: number;

  @ApiProperty()
  @Default(0)
  @Column(DataType.FLOAT)
  price: number;

  @ApiProperty()
  @Default(0)
  @Column(DataType.INTEGER)
  maxPeople: number;

  @ApiProperty({ type: () => ClubStudent, isArray: true, example: [{}] })
  @BelongsToMany(() => ClubStudent, () => ClubStudentSession)
  clubStudents: ClubStudent[];

  @ApiProperty({ type: () => Payment, isArray: true, example: [{}] })
  @BelongsToMany(() => Payment, () => PaymentTarget)
  payments: Payment[];

  @ApiProperty({ type: () => SessionSchedule, isArray: true, example: [{}] })
  @HasMany(() => SessionSchedule)
  sessionSchedules: SessionSchedule[];

  @ApiProperty({ type: () => SessionParticipant, isArray: true, example: [{}] })
  @HasMany(() => SessionParticipant)
  sessionParticipants: SessionParticipant[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const sessionProviders = [
  {
    provide: REPOSITORIES.SESSION,
    useValue: Session,
    sequelize,
    modelName: 'Sessions',
    hooks: {
      beforeCreate: (entity: Session) => {
        entity.id = v4();
      },
    },
  },
];
