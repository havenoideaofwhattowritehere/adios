import { v4 } from 'uuid';
import { CreateSessionInstanceDto } from '../../src/modules/session-instance/dto/create-session-instance.dto';
import { UpdateSessionInstanceDto } from '../../src/modules/session-instance/dto/update-session-instance.dto';

export const mockSessionInstanceCreate: CreateSessionInstanceDto = {
  datetime: new Date(),
  durationMinutes: Math.random(),
  sessionScheduleId: v4(),
  isCanceled: false,
};

export const mockSessionInstanceUpdate: UpdateSessionInstanceDto = {
  datetime: new Date(),
  durationMinutes: Math.random(),
  isCanceled: true,
};

export const mockSessionInstanceService = {
  createSessionInstance: jest.fn(),
  getSessionInstances: jest.fn(),
  getSessionInstance: jest.fn(),
  updateSessionInstance: jest.fn(),
  removeSessionInstance: jest.fn(),
};
