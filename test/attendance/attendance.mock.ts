import { v4 } from 'uuid';
import { CreateAttendanceDto } from '../../src/modules/attendance/dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../../src/modules/attendance/dto/update-attendance.dto';

export const mockAttendanceCreate: CreateAttendanceDto = {
  attended: true,
  sessionInstanceId: v4(),
  sessionStudentId: v4(),
};

export const mockAttendanceUpdate: UpdateAttendanceDto = {
  attended: false,
};

export const mockAttendanceService = {
  createAttendance: jest.fn(),
  getAttendances: jest.fn(),
  getAttendance: jest.fn(),
  updateAttendance: jest.fn(),
  removeAttendance: jest.fn(),
};
