import { v4 } from 'uuid';
import { CreateSessionDto } from '../../src/modules/session/dto/create-session.dto';
import { UpdateSessionDto } from '../../src/modules/session/dto/update-session.dto';
import { SessionType } from '../../src/modules/session/entities/session.entity';

export const mockSessionCreate: CreateSessionDto = {
  locationId: v4(),
  name: 'New Session',
  type: SessionType.GROUP,
  defaultDurationInMinutes: Math.random(),
  price: Math.random(),
  maxPeople: Math.floor(Math.random() * 100) + 10,
};

export const mockSessionUpdate: UpdateSessionDto = {
  name: 'Updated Session',
  type: SessionType.INDIVIDUAL,
  defaultDurationInMinutes: Math.random(),
  price: Math.random(),
  maxPeople: Math.floor(Math.random() * 100) + 10,
};

export const mockSessionService = {
  createSession: jest.fn(),
  getSessions: jest.fn(),
  getSession: jest.fn(),
  updateSession: jest.fn(),
  removeSession: jest.fn(),
};
