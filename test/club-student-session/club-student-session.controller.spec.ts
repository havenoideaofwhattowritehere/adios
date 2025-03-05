import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  ClubStudentSession,
  clubStudentSessionProviders,
} from '../../src/modules/club-student-session/entities/club-student-session.entity';
import { ClubStudentSessionController } from '../../src/modules/club-student-session/club-student-session.controller';
import { ClubStudentSessionService } from '../../src/modules/club-student-session/club-student-session.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { ClubStudentSessionRepository } from '../../src/modules/club-student-session/club-student-session.repository';
import {
  mockClubStudentSessionCreate,
  mockClubStudentSessionService,
  mockClubStudentSessionUpdate,
} from './club-student-session.mock';

describe('ClubStudentSessionController', () => {
  let controller: ClubStudentSessionController;
  let service: ClubStudentSessionService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ClubStudentSessionController],
      providers: [
        ClubStudentSessionService,
        ClubStudentSessionRepository,
        ...clubStudentSessionProviders,
      ],
    })
      .overrideProvider(ClubStudentSessionService)
      .useValue(mockClubStudentSessionService)
      .compile();

    controller = module.get<ClubStudentSessionController>(
      ClubStudentSessionController,
    );
    service = module.get<ClubStudentSessionService>(ClubStudentSessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createClubStudentSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createClubStudentSession')
        .mockImplementation(async () => new ClubStudentSession());
    });

    it('should be defined', () => {
      expect(service.createClubStudentSession).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createClubStudentSession(mockClubStudentSessionCreate);
      expect(service.createClubStudentSession).toBeCalledTimes(1);
    });

    it('should return created clubStudentSession', async () => {
      const result = await controller.createClubStudentSession(
        mockClubStudentSessionCreate,
      );
      id = result.id as UUID;
      expect(result).toBeInstanceOf(ClubStudentSession);
    });
  });

  describe('#getClubStudentSessions', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getClubStudentSessions')
        .mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getClubStudentSessions).toBeDefined();
    });

    it('should call service.getAll', () => {
      controller.getClubStudentSessions();
      expect(service.getClubStudentSessions).toBeCalledTimes(1);
    });

    it('should return all clubStudentSessions', async () => {
      const result = await controller.getClubStudentSessions();
      expect(result).toEqual([]);
    });
  });

  describe('#getClubStudentSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getClubStudentSession')
        .mockImplementation(async () => new ClubStudentSession());
    });

    it('should be defined', () => {
      expect(service.getClubStudentSession).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getClubStudentSession(id);
      expect(service.getClubStudentSession).toBeCalledTimes(1);
    });

    it('should return clubStudentSession', async () => {
      const result = await controller.getClubStudentSession(id);
      expect(result).toBeInstanceOf(ClubStudentSession);
    });
  });

  describe('#updateClubStudentSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateClubStudentSession')
        .mockImplementation(async () => new ClubStudentSession());
    });

    it('should be defined', () => {
      expect(service.updateClubStudentSession).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateClubStudentSession(id, mockClubStudentSessionUpdate);
      expect(service.updateClubStudentSession).toBeCalledTimes(1);
    });

    it('should return updated clubStudentSession', async () => {
      const result = await controller.updateClubStudentSession(
        id,
        mockClubStudentSessionUpdate,
      );
      expect(result).toBeInstanceOf(ClubStudentSession);
    });
  });

  describe('#removeClubStudentSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeClubStudentSession')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeClubStudentSession).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeClubStudentSession(id);
      expect(service.removeClubStudentSession).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeClubStudentSession(id);
      expect(result).toBeTruthy();
    });
  });
});
