import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UUID } from 'crypto';

import { REPOSITORIES } from '../../shared/helpers/repositories';
import { LOCATION_INCLUDE } from './entities/location.include';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { SearchLocationsDto } from './dto/search-location.dto';

@Injectable()
export class LocationRepository {
  constructor(
    @Inject(REPOSITORIES.LOCATION) private locationsRepository: typeof Location,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationsRepository.create<Location>(
      { ...createLocationDto },
      { include: LOCATION_INCLUDE.create() },
    );
  }

  async findAll(clubId: string): Promise<Location[]> {
    return this.locationsRepository.findAll({
      where: { clubId },
      include: LOCATION_INCLUDE.getAll(),
    });
  }

  async findAllWithQuery(
    clubId: string,
    payload?: SearchLocationsDto,
  ): Promise<Location[]> {
    return this.locationsRepository.findAll({
      where: payload?.name
        ? {
            clubId,
            name: { [Op.like as symbol]: `%${payload.name}%` },
          }
        : { clubId },
      include: LOCATION_INCLUDE.getAll(),
    });
  }

  async findOne(id: UUID): Promise<Location> {
    return this.locationsRepository.findOne({
      where: { id },
      include: LOCATION_INCLUDE.getOne(),
    });
  }

  async update(
    id: UUID,
    updateLocationDto: UpdateLocationDto,
  ): Promise<boolean> {
    const location = await this.locationsRepository.update(updateLocationDto, {
      where: { id },
    });
    return Boolean(location[0]);
  }

  async remove(id: UUID): Promise<boolean> {
    const location = await this.locationsRepository.destroy({ where: { id } });
    return Boolean(location);
  }
}
