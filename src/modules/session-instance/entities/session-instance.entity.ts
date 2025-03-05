import {
  Column,
  ForeignKey,
  Model,
  Table,
  PrimaryKey,
  DataType,
  Default,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { ISessionInstance } from '../../../shared/common/interfaces/models/session-instance.interface';
import { SessionSchedule } from '../../session-schedule/entities/session-schedule.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { ClubStudentSessionInstance } from '../../club-student-session-instance/entities/club-student-session-instance.entity';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({ tableName: 'session_instances', timestamps: false })
export class SessionInstance
  extends Model<SessionInstance>
  implements ISessionInstance
{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => SessionSchedule)
  @Column(DataType.UUID)
  sessionScheduleId: string;

  @ApiProperty({ type: () => SessionSchedule, example: {} })
  @BelongsTo(() => SessionSchedule)
  sessionSchedule: SessionSchedule;

  @ApiProperty()
  @Column(DataType.DATE)
  datetime: Date;

  @ApiProperty()
  @Column(DataType.INTEGER)
  durationMinutes: number;

  @ApiProperty()
  @Column(DataType.BOOLEAN)
  isCanceled: boolean;

  @ApiProperty({ type: () => Attendance, isArray: true, example: [{}] })
  @HasMany(() => Attendance)
  attendances: Attendance[];

  @ApiProperty({ type: () => ClubStudent, isArray: true, example: [{}] })
  @BelongsToMany(() => ClubStudent, () => ClubStudentSessionInstance)
  participants: ClubStudent[];
}

export const sessionInstanceProviders = [
  {
    provide: REPOSITORIES.SESSION_INSTANCE,
    useValue: SessionInstance,
    sequelize,
    modelName: 'SessionInstance',
    hooks: {
      beforeCreate: (entity: SessionInstance) => {
        entity.id = v4();
      },
    },
  },
];
