import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  Club,
  clubProviders,
} from '../../src/modules/club/entities/club.entity';
import { ClubController } from '../../src/modules/club/club.controller';
import { ClubService } from '../../src/modules/club/club.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { ClubRepository } from '../../src/modules/club/club.repository';
import { mockClubCreate, mockClubService, mockClubUpdate } from './club.mock';

describe('ClubController', () => {
  let controller: ClubController;
  let service: ClubService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ClubController],
      providers: [ClubService, ClubRepository, ...clubProviders],
    })
      .overrideProvider(ClubService)
      .useValue(mockClubService)
      .compile();

    controller = module.get<ClubController>(ClubController);
    service = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createClub', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createClub')
        .mockImplementation(async () => new Club());
    });

    it('should be defined', () => {
      expect(service.createClub).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createClub(mockClubCreate);
      expect(service.createClub).toBeCalledTimes(1);
    });

    it('should return created club', async () => {
      const result = await controller.createClub(mockClubCreate);
      id = result.id as UUID;
      expect(result).toBeInstanceOf(Club);
    });
  });

  describe('#getClubs', () => {
    // const mockUser: Partial<User> = {
    //   auth0UserId: 'auth0|some-user-id',
    //   id: 'auth0|some-user-id',
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   phone: '+1234567890',
    //   isRegistrationCompleted: true,
    // };

    beforeEach(() => {
      jest.spyOn(service, 'getClubsForUser').mockResolvedValue([]);
    });

    it('should be defined', () => {
      expect(service.getClubsForUser).toBeDefined();
    });
  });

  describe('#getClub', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getClub').mockImplementation(async () => new Club());
    });

    it('should be defined', () => {
      expect(service.getClub).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getClub(id);
      expect(service.getClub).toBeCalledTimes(1);
    });

    it('should return club', async () => {
      const result = await controller.getClub(id);
      expect(result).toBeInstanceOf(Club);
    });
  });

  describe('#updateClub', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateClub')
        .mockImplementation(async () => new Club());
    });

    it('should be defined', () => {
      expect(service.updateClub).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateClub(id, mockClubUpdate);
      expect(service.updateClub).toBeCalledTimes(1);
    });

    it('should return updated club', async () => {
      const result = await controller.updateClub(id, mockClubUpdate);
      expect(result).toBeInstanceOf(Club);
    });
  });

  describe('#removeClub', () => {
    beforeEach(() => {
      jest.spyOn(service, 'removeClub').mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeClub).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeClub(id);
      expect(service.removeClub).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeClub(id);
      expect(result).toBeTruthy();
    });
  });
});
