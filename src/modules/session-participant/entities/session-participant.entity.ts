import {
  Column,
  ForeignKey,
  Model,
  Table,
  DataType,
  CreatedAt,
  Default,
  UpdatedAt,
  PrimaryKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { Session } from '../../session/entities/session.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { ISessionParticipant } from '../../../shared/common/interfaces/models/session.interface';
import { UUID } from '../../../shared/common/interfaces/types';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Table({ tableName: 'session_participants' })
export class SessionParticipant
  extends Model<SessionParticipant>
  implements ISessionParticipant
{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => Session)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  sessionId: string;

  @ApiProperty({ type: () => Session, example: {} })
  @BelongsTo(() => Session)
  session: Session;

  @ApiProperty()
  @ForeignKey(() => ClubStudent)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  clubStudentId: string;

  @ApiProperty({ type: () => ClubStudent, example: {} })
  @BelongsTo(() => ClubStudent)
  clubStudent: ClubStudent;

  @ApiProperty({ type: () => ClubStudent, isArray: true, example: [{}] })
  @HasMany(() => Attendance)
  attendances: Attendance[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const sessionParticipantProviders = [
  {
    provide: REPOSITORIES.SESSION_PARTICIPANT,
    useValue: SessionParticipant,
    sequelize,
    modelName: 'SessionParticipant',
    hooks: {
      beforeCreate: (entity: SessionParticipant) => {
        entity.id = v4();
      },
    },
  },
];
