import { Test, TestingModule } from '@nestjs/testing';

import { AttendanceController } from '../../src/modules/attendance/attendance.controller';
import { AttendanceModule } from '../../src/modules/attendance/attendance.module';
import { AttendanceService } from '../../src/modules/attendance/attendance.service';

describe('AttendanceModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AttendanceModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('should have Attendance components', async () => {
    expect(module.get(AttendanceController)).toBeInstanceOf(
      AttendanceController,
    );
    expect(module.get(AttendanceService)).toBeInstanceOf(AttendanceService);
  });
});
