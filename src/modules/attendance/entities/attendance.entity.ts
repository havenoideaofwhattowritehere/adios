import {
  Column,
  ForeignKey,
  Model,
  Table,
  PrimaryKey,
  DataType,
  CreatedAt,
  Default,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { SessionInstance } from '../../session-instance/entities/session-instance.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { SessionParticipant } from '../../session-participant/entities/session-participant.entity';
import { IAttendance } from '../../../shared/common/interfaces/models/session-instance.interface';
import { UUID } from '../../../../src/shared/common/interfaces/types';

@Table({ tableName: 'attendances' })
export class Attendance extends Model<Attendance> implements IAttendance {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => SessionInstance)
  @Column(DataType.UUID)
  sessionInstanceId: string;

  @ApiProperty()
  @ForeignKey(() => SessionParticipant)
  @Column(DataType.UUID)
  sessionStudentId: string;

  @ApiProperty()
  @Column(DataType.BOOLEAN)
  attended: boolean;

  @ApiProperty({ type: () => SessionInstance })
  @BelongsTo(() => SessionInstance)
  sessionInstance: SessionInstance;

  @ApiProperty({ type: () => SessionParticipant })
  @BelongsTo(() => SessionParticipant)
  sessionParticipant: SessionParticipant;

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const attendanceProviders = [
  {
    provide: REPOSITORIES.ATTENDANCE,
    useValue: Attendance,
    sequelize,
    modelName: 'Attendance',
    hooks: {
      beforeCreate: (entity: Attendance) => {
        entity.id = v4();
      },
    },
  },
];
