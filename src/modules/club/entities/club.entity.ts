import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { IClub } from '../../../shared/common/interfaces/models/club.interface';
import { User } from '../../../modules/user/entities/user.entity';
import { ClubStaff } from '../../../modules/club-staff/entities/club-staff.entity';
import { ClubStudent } from '../../../modules/club-student/entities/club-student.entity';
import { Session } from '../../../modules/session/entities/session.entity';
import { Location } from '../../../modules/location/entities/location.entity';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({ tableName: 'clubs' })
export class Club extends Model<Club> implements IClub {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: UUID;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ type: () => User, isArray: true, example: [{}] })
  @BelongsToMany(() => User, () => ClubStaff)
  staff: User[];

  @ApiProperty({ type: () => User, isArray: true, example: [{}] })
  @BelongsToMany(() => User, () => ClubStudent)
  students: User[];

  @ApiProperty({ type: () => Session, isArray: true, example: [{}] })
  @HasMany(() => Session)
  sessions: Session[];

  @ApiProperty({ type: () => Location, isArray: true, example: [{}] })
  @HasMany(() => Location)
  locations: Location[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const clubProviders = [
  {
    provide: REPOSITORIES.CLUB,
    useValue: Club,
    sequelize,
    modelName: 'Club',
    hooks: {
      beforeCreate: (entity: Club) => {
        entity.id = v4();
      },
    },
  },
];
