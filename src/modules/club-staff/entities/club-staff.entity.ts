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

import { Club } from '../../../modules/club/entities/club.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IClubStaff } from '../../../shared/common/interfaces/models/user.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({ tableName: 'club_staffs' })
export class ClubStaff extends Model<ClubStaff> implements IClubStaff {
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
  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId: string;

  @ApiProperty({ type: () => User, example: {} })
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ enum: () => StaffStatus })
  @Column
  status: StaffStatus;

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const clubStaffProviders = [
  {
    provide: REPOSITORIES.CLUB_STAFF,
    useValue: ClubStaff,
    sequelize,
    modelName: 'ClubStaff',
    hooks: {
      beforeCreate: (entity: ClubStaff) => {
        entity.id = v4();
      },
    },
  },
];
