import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  Session,
  sessionProviders,
} from '../../src/modules/session/entities/session.entity';
import { SessionController } from '../../src/modules/session/session.controller';
import { SessionService } from '../../src/modules/session/session.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { SessionRepository } from '../../src/modules/session/session.repository';
import { mockSessionService, mockSessionUpdate } from './session.mock';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [SessionController],
      providers: [SessionService, SessionRepository, ...sessionProviders],
    })
      .overrideProvider(SessionService)
      .useValue(mockSessionService)
      .compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createSession')
        .mockImplementation(async () => new Session());
    });

    it('should be defined', () => {
      expect(service.createSession).toBeDefined();
    });
  });

  describe('#getSessions', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getSessions').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getSessions).toBeDefined();
    });
  });

  describe('#getSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getSession')
        .mockImplementation(async () => new Session());
    });

    it('should be defined', () => {
      expect(service.getSession).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getSession(id);
      expect(service.getSession).toBeCalledTimes(1);
    });

    it('should return session', async () => {
      const result = await controller.getSession(id);
      expect(result).toBeInstanceOf(Session);
    });
  });

  describe('#updateSession', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateSession')
        .mockImplementation(async () => new Session());
    });

    it('should be defined', () => {
      expect(service.updateSession).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateSession(id, mockSessionUpdate);
      expect(service.updateSession).toBeCalledTimes(1);
    });

    it('should return updated session', async () => {
      const result = await controller.updateSession(id, mockSessionUpdate);
      expect(result).toBeInstanceOf(Session);
    });
  });

  describe('#removeSession', () => {
    beforeEach(() => {
      jest.spyOn(service, 'removeSession').mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeSession).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeSession(id);
      expect(service.removeSession).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeSession(id);
      expect(result).toBeTruthy();
    });
  });
});
