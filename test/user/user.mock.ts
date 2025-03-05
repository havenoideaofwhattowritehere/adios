import { UpdateUserDto } from '../../src/modules/user/dto/update-user.dto';
import { CreateUserDto } from '../../src/modules/user/dto/create-user.dto';
import { Gender } from '../../src/modules/user/entities/user.entity';

export const mockUserCreate: CreateUserDto = {
  isRegistrationCompleted: false,
  firstName: 'Joe',
  lastName: 'Dou',
  phone: '+111111111',
  gender: Gender.MALE,
  auth0UserId: 'auth0UserId',
};

export const mockUserUpdate: UpdateUserDto = {
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+222222222',
};

export const mockUserService = {
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  removeUsers: jest.fn(),
};
