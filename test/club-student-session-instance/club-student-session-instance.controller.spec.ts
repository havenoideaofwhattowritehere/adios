import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  ClubStudentSessionInstance,
  clubStudentSessionInstanceProviders,
} from '../../src/modules/club-student-session-instance/entities/club-student-session-instance.entity';
import { ClubStudentSessionInstanceController } from '../../src/modules/club-student-session-instance/club-student-session-instance.controller';
import { ClubStudentSessionInstanceService } from '../../src/modules/club-student-session-instance/club-student-session-instance.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { ClubStudentSessionInstanceRepository } from '../../src/modules/club-student-session-instance/club-student-session-instance.repository';
import {
  mockClubStudentSessionInstanceCreate,
  mockClubStudentSessionInstanceService,
  mockClubStudentSessionInstanceUpdate,
} from './club-student-session-instance.mock';

describe('ClubStudentSessionInstanceController', () => {
  let controller: ClubStudentSessionInstanceController;
  let service: ClubStudentSessionInstanceService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ClubStudentSessionInstanceController],
      providers: [
        ClubStudentSessionInstanceService,
        ClubStudentSessionInstanceRepository,
        ...clubStudentSessionInstanceProviders,
      ],
    })
      .overrideProvider(ClubStudentSessionInstanceService)
      .useValue(mockClubStudentSessionInstanceService)
      .compile();

    controller = module.get<ClubStudentSessionInstanceController>(
      ClubStudentSessionInstanceController,
    );
    service = module.get<ClubStudentSessionInstanceService>(
      ClubStudentSessionInstanceService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createClubStudentSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createClubStudentSessionInstance')
        .mockImplementation(async () => new ClubStudentSessionInstance());
    });

    it('should be defined', () => {
      expect(service.createClubStudentSessionInstance).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createClubStudentSessionInstance(
        mockClubStudentSessionInstanceCreate,
      );
      expect(service.createClubStudentSessionInstance).toBeCalledTimes(1);
    });

    it('should return created clubStudentSessionInstance', async () => {
      const result = await controller.createClubStudentSessionInstance(
        mockClubStudentSessionInstanceCreate,
      );
      id = result.id as UUID;
      expect(result).toBeInstanceOf(ClubStudentSessionInstance);
    });
  });

  describe('#getClubStudentSessionInstances', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getClubStudentSessionInstances')
        .mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getClubStudentSessionInstances).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getClubStudentSessionInstances();
      expect(service.getClubStudentSessionInstances).toBeCalledTimes(1);
    });

    it('should return all clubStudentSessionInstances', async () => {
      const result = await controller.getClubStudentSessionInstances();
      expect(result).toEqual([]);
    });
  });

  describe('#getClubStudentSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getClubStudentSessionInstance')
        .mockImplementation(async () => new ClubStudentSessionInstance());
    });

    it('should be defined', () => {
      expect(service.getClubStudentSessionInstance).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getClubStudentSessionInstance(id);
      expect(service.getClubStudentSessionInstance).toBeCalledTimes(1);
    });

    it('should return clubStudentSessionInstance', async () => {
      const result = await controller.getClubStudentSessionInstance(id);
      expect(result).toBeInstanceOf(ClubStudentSessionInstance);
    });
  });

  describe('#updateClubStudentSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateClubStudentSessionInstance')
        .mockImplementation(async () => new ClubStudentSessionInstance());
    });

    it('should be defined', () => {
      expect(service.updateClubStudentSessionInstance).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateClubStudentSessionInstance(
        id,
        mockClubStudentSessionInstanceUpdate,
      );
      expect(service.updateClubStudentSessionInstance).toBeCalledTimes(1);
    });

    it('should return updated clubStudentSessionInstance', async () => {
      const result = await controller.updateClubStudentSessionInstance(
        id,
        mockClubStudentSessionInstanceUpdate,
      );
      expect(result).toBeInstanceOf(ClubStudentSessionInstance);
    });
  });

  describe('#removeClubStudentSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeClubStudentSessionInstance')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeClubStudentSessionInstance).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeClubStudentSessionInstance(id);
      expect(service.removeClubStudentSessionInstance).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeClubStudentSessionInstance(id);
      expect(result).toBeTruthy();
    });
  });
});
