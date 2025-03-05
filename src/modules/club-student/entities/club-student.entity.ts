import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { Session } from '../../../modules/session/entities/session.entity';
import { ClubStudentSession } from '../../../modules/club-student-session/entities/club-student-session.entity';
import { Payment } from '../../../modules/payment/entities/payment.entity';
import { Club } from '../../../modules/club/entities/club.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { SessionInstance } from '../../../modules/session-instance/entities/session-instance.entity';
import { ClubStudentSessionInstance } from '../../../modules/club-student-session-instance/entities/club-student-session-instance.entity';
import { IClubStudent } from '../../../shared/common/interfaces/models/user.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({ tableName: 'club_students' })
export class ClubStudent extends Model<ClubStudent> implements IClubStudent {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @ForeignKey(() => Club)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  clubId: UUID;

  @ApiProperty({ type: () => Club, example: {} })
  @BelongsTo(() => Club)
  club: Club;

  @ApiProperty()
  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId: UUID;

  @ApiProperty({ type: () => User, example: {} })
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ enum: () => StudentStatus })
  @Column(DataType.ENUM('active', 'inactive'))
  status: StudentStatus;

  @ApiProperty({ type: () => Payment, isArray: true, example: [{}] })
  @HasMany(() => Payment)
  payments: Payment[];

  @ApiProperty({ type: () => Session, isArray: true, example: [{}] })
  @BelongsToMany(() => Session, () => ClubStudentSession)
  sessions: Session[];

  @ApiProperty({ type: () => SessionInstance, isArray: true, example: [{}] })
  @BelongsToMany(() => SessionInstance, () => ClubStudentSessionInstance)
  sessionInstances: SessionInstance[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const clubStudentProviders = [
  {
    provide: REPOSITORIES.CLUB_STUDENT,
    useValue: ClubStudent,
    sequelize,
    modelName: 'ClubStudent',
    hooks: {
      beforeCreate: (entity: ClubStudent) => {
        entity.id = v4();
      },
    },
  },
];
