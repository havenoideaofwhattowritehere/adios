import { v4 } from 'uuid';
import { CreateClubStudentSessionInstanceDto } from '../../src/modules/club-student-session-instance/dto/create-club-student-session-instance.dto';
import { UpdateClubStudentSessionInstanceDto } from '../../src/modules/club-student-session-instance/dto/update-club-student-session-instance.dto';

export const mockClubStudentSessionInstanceCreate: CreateClubStudentSessionInstanceDto =
  {
    clubStudentId: v4(),
    sessionInstanceId: v4(),
  };

export const mockClubStudentSessionInstanceUpdate: UpdateClubStudentSessionInstanceDto =
  {};

export const mockClubStudentSessionInstanceService = {
  createClubStudentSessionInstance: jest.fn(),
  getClubStudentSessionInstances: jest.fn(),
  getClubStudentSessionInstance: jest.fn(),
  updateClubStudentSessionInstance: jest.fn(),
  removeClubStudentSessionInstance: jest.fn(),
};
