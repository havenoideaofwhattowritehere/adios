import { CreateLocationDto } from '../../src/modules/location/dto/create-location.dto';
import { UpdateLocationDto } from '../../src/modules/location/dto/update-location.dto';

export const mockLocationCreate: CreateLocationDto = {
  name: 'New Location',
  maxPeople: Math.floor(Math.random() * 100) + 10,
  lat: Math.random() * 180 - 90,
  lng: Math.random() * 360 - 180,
  gMapName: 'New Map',
};

export const mockLocationUpdate: UpdateLocationDto = {
  name: 'Updated Location',
  maxPeople: Math.floor(Math.random() * 100) + 10,
  lat: Math.random() * 180 - 90,
  lng: Math.random() * 360 - 180,
  gMapName: 'Updated Map',
};

export const mockLocationService = {
  createLocation: jest.fn(),
  getLocations: jest.fn(),
  getLocation: jest.fn(),
  updateLocation: jest.fn(),
  removeLocation: jest.fn(),
};
