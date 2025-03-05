import { Module } from '@nestjs/common';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';
import { attendanceProviders } from './entities/attendance.entity';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository, ...attendanceProviders],
  exports: [AttendanceModule, AttendanceService],
})
export class AttendanceModule {}
