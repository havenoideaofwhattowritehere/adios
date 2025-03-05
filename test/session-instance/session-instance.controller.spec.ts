import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  SessionInstance,
  sessionInstanceProviders,
} from '../../src/modules/session-instance/entities/session-instance.entity';
import { SessionInstanceController } from '../../src/modules/session-instance/session-instance.controller';
import { SessionInstanceService } from '../../src/modules/session-instance/session-instance.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { SessionInstanceRepository } from '../../src/modules/session-instance/session-instance.repository';
import {
  mockSessionInstanceService,
  mockSessionInstanceUpdate,
} from './session-instance.mock';

describe('SessionInstanceController', () => {
  let controller: SessionInstanceController;
  let service: SessionInstanceService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [SessionInstanceController],
      providers: [
        SessionInstanceService,
        SessionInstanceRepository,
        ...sessionInstanceProviders,
      ],
    })
      .overrideProvider(SessionInstanceService)
      .useValue(mockSessionInstanceService)
      .compile();

    controller = module.get<SessionInstanceController>(
      SessionInstanceController,
    );
    service = module.get<SessionInstanceService>(SessionInstanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createSessionInstance')
        .mockImplementation(async () => new SessionInstance());
    });

    it('should be defined', () => {
      expect(service.createSessionInstance).toBeDefined();
    });
  });

  describe('#getSessionInstances', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getSessionInstances')
        .mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getSessionInstances).toBeDefined();
    });
  });

  describe('#getSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getSessionInstance')
        .mockImplementation(async () => new SessionInstance());
    });

    it('should be defined', () => {
      expect(service.getSessionInstance).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getSessionInstance(id);
      expect(service.getSessionInstance).toBeCalledTimes(1);
    });

    it('should return sessionInstance', async () => {
      const result = await controller.getSessionInstance(id);
      expect(result).toBeInstanceOf(SessionInstance);
    });
  });

  describe('#updateSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateSessionInstance')
        .mockImplementation(async () => new SessionInstance());
    });

    it('should be defined', () => {
      expect(service.updateSessionInstance).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateSessionInstance(id, mockSessionInstanceUpdate);
      expect(service.updateSessionInstance).toBeCalledTimes(1);
    });

    it('should return updated sessionInstance', async () => {
      const result = await controller.updateSessionInstance(
        id,
        mockSessionInstanceUpdate,
      );
      expect(result).toBeInstanceOf(SessionInstance);
    });
  });

  describe('#removeSessionInstance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeSessionInstance')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeSessionInstance).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeSessionInstance(id);
      expect(service.removeSessionInstance).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeSessionInstance(id);
      expect(result).toBeTruthy();
    });
  });
});
