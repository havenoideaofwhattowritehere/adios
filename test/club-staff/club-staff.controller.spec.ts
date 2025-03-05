import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  ClubStaff,
  clubStaffProviders,
} from '../../src/modules/club-staff/entities/club-staff.entity';
import { ClubStaffController } from '../../src/modules/club-staff/club-staff.controller';
import { ClubStaffService } from '../../src/modules/club-staff/club-staff.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { ClubStaffRepository } from '../../src/modules/club-staff/club-staff.repository';
import {
  mockClubStaffCreate,
  mockClubStaffService,
  mockClubStaffUpdate,
} from './club-staff.mock';

describe('ClubStaffController', () => {
  let controller: ClubStaffController;
  let service: ClubStaffService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ClubStaffController],
      providers: [ClubStaffService, ClubStaffRepository, ...clubStaffProviders],
    })
      .overrideProvider(ClubStaffService)
      .useValue(mockClubStaffService)
      .compile();

    controller = module.get<ClubStaffController>(ClubStaffController);
    service = module.get<ClubStaffService>(ClubStaffService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createClubStaff', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createClubStaff')
        .mockImplementation(async () => new ClubStaff());
    });

    it('should be defined', () => {
      expect(service.createClubStaff).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createClubStaff(mockClubStaffCreate);
      expect(service.createClubStaff).toBeCalledTimes(1);
    });

    it('should return created clubStaff', async () => {
      const result = await controller.createClubStaff(mockClubStaffCreate);
      id = result.id as UUID;
      expect(result).toBeInstanceOf(ClubStaff);
    });
  });

  describe('#getClubStaffs', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getClubStaffs').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getClubStaffs).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getClubStaffs();
      expect(service.getClubStaffs).toBeCalledTimes(1);
    });

    it('should return all clubStaffs', async () => {
      const result = await controller.getClubStaffs();
      expect(result).toEqual([]);
    });
  });

  describe('#getClubStaff', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getClubStaff')
        .mockImplementation(async () => new ClubStaff());
    });

    it('should be defined', () => {
      expect(service.getClubStaff).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getClubStaff(id);
      expect(service.getClubStaff).toBeCalledTimes(1);
    });

    it('should return clubStaff', async () => {
      const result = await controller.getClubStaff(id);
      expect(result).toBeInstanceOf(ClubStaff);
    });
  });

  describe('#updateClubStaff', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateClubStaff')
        .mockImplementation(async () => new ClubStaff());
    });

    it('should be defined', () => {
      expect(service.updateClubStaff).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateClubStaff(id, mockClubStaffUpdate);
      expect(service.updateClubStaff).toBeCalledTimes(1);
    });

    it('should return updated clubStaff', async () => {
      const result = await controller.updateClubStaff(id, mockClubStaffUpdate);
      expect(result).toBeInstanceOf(ClubStaff);
    });
  });

  describe('#removeClubStaff', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeClubStaff')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeClubStaff).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeClubStaff(id);
      expect(service.removeClubStaff).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeClubStaff(id);
      expect(result).toBeTruthy();
    });
  });
});
