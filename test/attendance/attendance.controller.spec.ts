import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';

import {
  Attendance,
  attendanceProviders,
} from '../../src/modules/attendance/entities/attendance.entity';
import { AttendanceController } from '../../src/modules/attendance/attendance.controller';
import { AttendanceService } from '../../src/modules/attendance/attendance.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { AttendanceRepository } from '../../src/modules/attendance/attendance.repository';
import {
  mockAttendanceCreate,
  mockAttendanceService,
  mockAttendanceUpdate,
} from './attendance.mock';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;
  let id: UUID;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AttendanceController],
      providers: [
        AttendanceService,
        AttendanceRepository,
        ...attendanceProviders,
      ],
    })
      .overrideProvider(AttendanceService)
      .useValue(mockAttendanceService)
      .compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createAttendance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'createAttendance')
        .mockImplementation(async () => new Attendance());
    });

    it('should be defined', () => {
      expect(service.createAttendance).toBeDefined();
    });

    it('should call service.create', () => {
      controller.createAttendance(mockAttendanceCreate);
      expect(service.createAttendance).toBeCalledTimes(1);
    });

    it('should return created attendance', async () => {
      const result = await controller.createAttendance(mockAttendanceCreate);
      id = result.id as UUID;
      expect(result).toBeInstanceOf(Attendance);
    });
  });

  describe('#getAttendances', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getAttendances').mockImplementation(async () => []);
    });

    it('should be defined', () => {
      expect(service.getAttendances).toBeDefined();
    });
  });

  describe('#getAttendance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'getAttendance')
        .mockImplementation(async () => new Attendance());
    });

    it('should be defined', () => {
      expect(service.getAttendance).toBeDefined();
    });

    it('should call service.get', () => {
      controller.getAttendance(id);
      expect(service.getAttendance).toBeCalledTimes(1);
    });

    it('should return attendance', async () => {
      const result = await controller.getAttendance(id);
      expect(result).toBeInstanceOf(Attendance);
    });
  });

  describe('#updateAttendance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'updateAttendance')
        .mockImplementation(async () => new Attendance());
    });

    it('should be defined', () => {
      expect(service.updateAttendance).toBeDefined();
    });

    it('should call service.update', () => {
      controller.updateAttendance(id, mockAttendanceUpdate);
      expect(service.updateAttendance).toBeCalledTimes(1);
    });

    it('should return updated attendance', async () => {
      const result = await controller.updateAttendance(
        id,
        mockAttendanceUpdate,
      );
      expect(result).toBeInstanceOf(Attendance);
    });
  });

  describe('#removeAttendance', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'removeAttendance')
        .mockImplementation(async () => true);
    });

    it('should be defined', () => {
      expect(service.removeAttendance).toBeDefined();
    });

    it('should call service.remove', () => {
      controller.removeAttendance(id);
      expect(service.removeAttendance).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const result = await controller.removeAttendance(id);
      expect(result).toBeTruthy();
    });
  });
});
