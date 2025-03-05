import { v4 } from 'uuid';
import { CreateClubStudentSessionDto } from '../../src/modules/club-student-session/dto/create-club-student-session.dto';
import { UpdateClubStudentSessionDto } from '../../src/modules/club-student-session/dto/update-club-student-session.dto';

export const mockClubStudentSessionCreate: CreateClubStudentSessionDto = {
  clubStudentId: v4(),
  sessionId: v4(),
};

export const mockClubStudentSessionUpdate: UpdateClubStudentSessionDto = {};

export const mockClubStudentSessionService = {
  createClubStudentSession: jest.fn(),
  getClubStudentSessions: jest.fn(),
  getClubStudentSession: jest.fn(),
  updateClubStudentSession: jest.fn(),
  removeClubStudentSession: jest.fn(),
};
