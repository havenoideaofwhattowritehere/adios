import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  User,
  userProviders,
} from '../../src/modules/user/entities/user.entity';
import { UserController } from '../../src/modules/user/user.controller';
import { UserService } from '../../src/modules/user/user.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { UserRepository } from '../../src/modules/user/user.repository';
import { Hash } from '../../src/shared/helpers/hash';
import { mockUserCreate, mockUserService, mockUserUpdate } from './user.mock';
import { ClubService } from '../../src/modules/club/club.service';
import { LoggerModule } from '../../src/shared/logging/logger.module';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let id: UUID;

  const mockClubService = {
    getClub: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LoggerModule],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: ClubService, useValue: mockClubService },
        UserRepository,
        ...userProviders,
        Hash,
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createUser', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createUser')
        .mockImplementation(async () => new User());
    });

    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createUser(mockUserCreate);
      expect(service.createUser).toBeCalledTimes(1);
    });

    it('should return created user', async () => {
      const result = await controller.createUser(mockUserCreate);
      id = result.id as UUID;
      expect(result).toBeInstanceOf(User);
    });
  });

  describe('#getUsers', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getUsers').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getUsers).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getUsers();
      expect(service.getUsers).toBeCalledTimes(1);
    });

    it('should return all users', async () => {
      const result = await controller.getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('#getUser', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getUser').mockImplementation(async () => new User());
    });

    it('should be defined', () => {
      expect(service.getUser).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getUser(id);
      expect(service.getUser).toBeCalledTimes(1);
    });

    it('should return user', async () => {
      const result = await controller.getUser(id);
      expect(result).toBeInstanceOf(User);
    });
  });

  describe('#updateUser', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateUser')
        .mockImplementation(async () => new User());
    });

    it('should be defined', () => {
      expect(service.updateUser).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateUser(id, mockUserUpdate);
      expect(service.updateUser).toBeCalledTimes(1);
    });

    it('should return updated user', async () => {
      const result = await controller.updateUser(id, mockUserUpdate);
      expect(result).toBeInstanceOf(User);
    });
  });

  describe('#removeUsers', () => {
    beforeEach(() => {
      jest.spyOn(service, 'removeUsers').mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeUsers).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeUser(id);
      expect(service.removeUsers).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeUser(id);
      expect(result).toBeTruthy();
    });
  });
});
