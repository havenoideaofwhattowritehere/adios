import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  ForeignKey,
  Default,
  UpdatedAt,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { Session } from '../../session/entities/session.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { SessionInstance } from '../../session-instance/entities/session-instance.entity';
import { ISessionSchedule } from '../../../shared/common/interfaces/models/session-schedule.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum SessionScheduleType {
  ONCE = 'ONCE',
  WEEKLY = 'WEEKLY',
}

@Table({ tableName: 'session_schedules' })
export class SessionSchedule
  extends Model<SessionSchedule>
  implements ISessionSchedule
{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => Session)
  @Column(DataType.UUID)
  sessionId: string;

  @ApiProperty({ type: () => Session, example: {} })
  @BelongsTo(() => Session)
  session: Session;

  @ApiProperty({ enum: () => SessionScheduleType })
  @Column(DataType.ENUM('ONCE', 'WEEKLY'))
  type: SessionScheduleType;

  @ApiProperty()
  @Column(DataType.INTEGER)
  durationMinutes: number;

  @ApiProperty()
  @Column(DataType.TIME)
  time: string;

  @ApiProperty()
  @Column(DataType.DATE)
  onceDate?: Date;

  @ApiProperty()
  @Column(DataType.DATE)
  startDate?: Date;

  @ApiProperty()
  @Column(DataType.DATE)
  endDate?: Date;

  @ApiProperty()
  @Column(DataType.STRING)
  dayOfWeekMask?: string;

  @ApiProperty({ type: () => SessionInstance, isArray: true, example: [{}] })
  @HasMany(() => SessionInstance)
  sessionInstances: SessionInstance[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const sessionScheduleProviders = [
  {
    provide: REPOSITORIES.SESSION_SCHEDULE,
    useValue: SessionSchedule,
    sequelize,
    modelName: 'SessionSchedule',
    hooks: {
      beforeCreate: (entity: SessionSchedule) => {
        entity.id = v4();
      },
    },
  },
];
