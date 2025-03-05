import { v4 } from 'uuid';
import { CreateClubStudentDto } from '../../src/modules/club-student/dto/create-club-student.dto';
import { UpdateClubStudentDto } from '../../src/modules/club-student/dto/update-club-student.dto';
import { StudentStatus } from '../../src/modules/club-student/entities/club-student.entity';

export const mockClubStudentCreate: CreateClubStudentDto = {
  clubId: v4(),
  userId: v4(),
  status: StudentStatus.ACTIVE,
};

export const mockClubStudentUpdate: UpdateClubStudentDto = {
  status: StudentStatus.INACTIVE,
};

export const mockClubStudentService = {
  createClubStudent: jest.fn(),
  getClubStudents: jest.fn(),
  getClubStudent: jest.fn(),
  updateClubStudent: jest.fn(),
  removeClubStudent: jest.fn(),
};
