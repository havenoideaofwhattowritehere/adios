import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { Club } from '../../../modules/club/entities/club.entity';
import { ClubStaff } from '../../../modules/club-staff/entities/club-staff.entity';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IUser } from '../../../shared/common/interfaces/models/user.interface';
import { UUID } from '../../../shared/common/interfaces/types';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Table({ tableName: 'users' })
export class User extends Model<User> implements IUser {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @Column(DataType.STRING)
  auth0UserId: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
  firstName: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
  lastName: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @ApiProperty()
  @Default(false)
  @Column(DataType.BOOLEAN)
  isRegistrationCompleted: boolean;

  @ApiProperty({ enum: () => Gender })
  @Column({ type: DataType.ENUM('male', 'female'), allowNull: true })
  gender: Gender;

  @ApiProperty()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  birthday: Date;

  @ApiProperty()
  @Column({ type: DataType.FLOAT, allowNull: true })
  weight: number;

  @ApiProperty()
  @Column({ type: DataType.FLOAT, allowNull: true })
  height: number;

  @ApiProperty({ type: () => Club, isArray: true, example: [{}] })
  @BelongsToMany(() => Club, () => ClubStaff)
  clubsAsStaff: Club[];

  @ApiProperty({ type: () => Club, isArray: true, example: [{}] })
  @BelongsToMany(() => Club, () => ClubStudent)
  clubsAsStudent: Club[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const userProviders = [
  {
    provide: REPOSITORIES.USER,
    useValue: User,
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (entity: User) => {
        entity.id = v4();
      },
    },
  },
];
