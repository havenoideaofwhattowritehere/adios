import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { SessionInstance } from '../../session-instance/entities/session-instance.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IClubStudentSessionInstance } from '../../../shared/common/interfaces/models/session-instance.interface';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({
  tableName: 'club_student_session_instances',
})
export class ClubStudentSessionInstance
  extends Model<ClubStudentSessionInstance>
  implements IClubStudentSessionInstance
{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => ClubStudent)
  @Column(DataType.UUID)
  clubStudentId: string;

  @ApiProperty({ type: () => ClubStudent, example: {} })
  @BelongsTo(() => ClubStudent)
  clubStudent: ClubStudent;

  @ApiProperty()
  @ForeignKey(() => SessionInstance)
  @Column(DataType.UUID)
  sessionInstanceId: string;

  @ApiProperty({ type: () => SessionInstance, example: {} })
  @BelongsTo(() => SessionInstance)
  sessionInstance: SessionInstance;

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const clubStudentSessionInstanceProviders = [
  {
    provide: REPOSITORIES.CLUB_STUDENT_SESSION_INSTANCE,
    useValue: ClubStudentSessionInstance,
    sequelize,
    modelName: 'ClubStudentSessionInstance',
    hooks: {
      beforeCreate: (entity: ClubStudentSessionInstance) => {
        entity.id = v4();
      },
    },
  },
];
