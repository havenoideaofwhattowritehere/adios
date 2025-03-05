import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UUID } from 'crypto';

import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { LocationRepository } from './location.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { SearchLocationsDto } from './dto/search-location.dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  constructor(private readonly locationsRepository: LocationRepository) {}

  async createLocation(
    createLocationDto: CreateLocationDto,
    clubId: string,
  ): Promise<Location> {
    const locationDto = {
      ...createLocationDto,
      clubId,
    };

    try {
      const location = await this.locationsRepository.create(locationDto);
      this.logger.log(`Location with ID ${location.id} was created`);
      return location;
    } catch (error) {
      this.logger.error(
        `Failed to create location: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(ErrorMap.CANNOT_CREATE_MODEL);
    }
  }

  async getLocations(
    clubId: string,
    payload?: SearchLocationsDto,
  ): Promise<Location[]> {
    const locations = payload
      ? await this.locationsRepository.findAllWithQuery(clubId, payload)
      : await this.locationsRepository.findAll(clubId);

    if (!locations) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return locations;
  }

  async getLocation(id: UUID): Promise<Location> {
    const location = await this.locationsRepository.findOne(id);

    if (!location) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return location;
  }

  async updateLocation(
    id: UUID,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const isLocationUpdated = await this.locationsRepository.update(
      id,
      updateLocationDto,
    );

    if (!isLocationUpdated) {
      throw new BadRequestException(ErrorMap.CANNOT_UPDATE_MODEL);
    }

    return this.locationsRepository.findOne(id);
  }

  async removeLocation(id: UUID): Promise<boolean> {
    const isLocationRemoved = await this.locationsRepository.remove(id);

    if (!isLocationRemoved) {
      throw new BadRequestException(ErrorMap.CANNOT_DELETE_MODEL);
    }

    return isLocationRemoved;
  }
}
