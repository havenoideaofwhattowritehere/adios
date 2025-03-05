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

import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { Session } from '../../../modules/session/entities/session.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IClubStudentSession } from '../../../shared/common/interfaces/models/session.interface';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({ tableName: 'club_student_sessions' })
export class ClubStudentSession
  extends Model<ClubStudentSession>
  implements IClubStudentSession
{
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
  @ForeignKey(() => Session)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  sessionId: string;

  @ApiProperty({ type: () => Session, example: {} })
  @BelongsTo(() => Session)
  session: Session;

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const clubStudentSessionProviders = [
  {
    provide: REPOSITORIES.CLUB_STUDENT_SESSION,
    useValue: ClubStudentSession,
    sequelize,
    modelName: 'ClubStudentSession',
    hooks: {
      beforeCreate: (entity: ClubStudentSession) => {
        entity.id = v4();
      },
    },
  },
];
