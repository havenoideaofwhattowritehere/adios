import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  Default,
  UpdatedAt,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { REPOSITORIES } from '../../../shared/helpers/repositories';
import { ILocation } from '../../../shared/common/interfaces/models/location.interface';
import { Club } from '../../../modules/club/entities/club.entity';
import { Session } from '../../../modules/session/entities/session.entity';
import { SessionInstance } from '../../../modules/session-instance/entities/session-instance.entity';
import { UUID } from '../../../shared/common/interfaces/types';

@Table({ tableName: 'locations' })
export class Location extends Model<Location> implements ILocation {
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
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @Column(DataType.INTEGER)
  maxPeople: number;

  @ApiProperty()
  @Column(DataType.FLOAT)
  lat: number;

  @ApiProperty()
  @Column(DataType.FLOAT)
  lng: number;

  @ApiProperty()
  @Column(DataType.STRING)
  gMapName: string;

  @ApiProperty({ type: () => Session, isArray: true, example: [{}] })
  @HasMany(() => Session)
  sessions: Session[];

  @ApiProperty()
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  declare updatedAt: Date;
}

export const locationProviders = [
  {
    provide: REPOSITORIES.LOCATION,
    useValue: Location,
    sequelize,
    modelName: 'locations',
    hooks: {
      beforeCreate: (entity: Location) => {
        entity.id = v4();
      },
    },
  },
];
