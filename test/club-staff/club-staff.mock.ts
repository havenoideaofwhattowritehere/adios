import { v4 } from 'uuid';
import { CreateClubStaffDto } from '../../src/modules/club-staff/dto/create-club-staff.dto';
import { UpdateClubStaffDto } from '../../src/modules/club-staff/dto/update-club-staff.dto';
import { StaffStatus } from '../../src/modules/club-staff/entities/club-staff.entity';

export const mockClubStaffCreate: CreateClubStaffDto = {
  clubId: v4(),
  userId: v4(),
  status: StaffStatus.ACTIVE,
};

export const mockClubStaffUpdate: UpdateClubStaffDto = {
  status: StaffStatus.INACTIVE,
};

export const mockClubStaffService = {
  createClubStaff: jest.fn(),
  getClubStaffs: jest.fn(),
  getClubStaff: jest.fn(),
  updateClubStaff: jest.fn(),
  removeClubStaff: jest.fn(),
};
