import { CreateClubDto } from '../../src/modules/club/dto/create-club.dto';
import { UpdateClubDto } from '../../src/modules/club/dto/update-club.dto';

export const mockClubCreate: CreateClubDto = {
  name: 'New Club',
};

export const mockClubUpdate: UpdateClubDto = {
  name: 'Updated Club',
};

export const mockClubService = {
  createClub: jest.fn(),
  getClubs: jest.fn(),
  getClub: jest.fn(),
  updateClub: jest.fn(),
  removeClub: jest.fn(),
  getClubsForUser: jest.fn(),
};
