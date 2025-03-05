import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  Location,
  locationProviders,
} from '../../src/modules/location/entities/location.entity';
import { LocationController } from '../../src/modules/location/location.controller';
import { LocationService } from '../../src/modules/location/location.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { LocationRepository } from '../../src/modules/location/location.repository';
import { mockLocationService, mockLocationUpdate } from './location.mock';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [LocationController],
      providers: [LocationService, LocationRepository, ...locationProviders],
    })
      .overrideProvider(LocationService)
      .useValue(mockLocationService)
      .compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createLocation', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createLocation')
        .mockImplementation(async () => new Location());
    });

    it('should be defined', () => {
      expect(service.createLocation).toBeDefined();
    });
  });

  describe('#getLocations', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getLocations').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getLocations).toBeDefined();
    });
  });

  describe('#getLocation', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getLocation')
        .mockImplementation(async () => new Location());
    });

    it('should be defined', () => {
      expect(service.getLocation).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getLocation(id);
      expect(service.getLocation).toBeCalledTimes(1);
    });

    it('should return location', async () => {
      const result = await controller.getLocation(id);
      expect(result).toBeInstanceOf(Location);
    });
  });

  describe('#updateLocation', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateLocation')
        .mockImplementation(async () => new Location());
    });

    it('should be defined', () => {
      expect(service.updateLocation).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateLocation(id, mockLocationUpdate);
      expect(service.updateLocation).toBeCalledTimes(1);
    });

    it('should return updated location', async () => {
      const result = await controller.updateLocation(id, mockLocationUpdate);
      expect(result).toBeInstanceOf(Location);
    });
  });

  describe('#removeLocation', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeLocation')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeLocation).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeLocation(id);
      expect(service.removeLocation).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeLocation(id);
      expect(result).toBeTruthy();
    });
  });
});
