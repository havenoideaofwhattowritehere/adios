import { Module } from '@nestjs/common';

import { SessionScheduleController } from './session-schedule.controller';
import { SessionScheduleService } from './session-schedule.service';
import { SessionScheduleRepository } from './session-schedule.repository';
import { sessionScheduleProviders } from './entities/session-schedule.entity';
import { SessionInstanceModule } from '../session-instance/session-instance.module';
import { DateUtil } from '../../shared/common/utils/date/date.util';
import { DatabaseModule } from '../../core/database/database.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [DatabaseModule, SessionInstanceModule, AttendanceModule],
  controllers: [SessionScheduleController],
  providers: [
    SessionScheduleService,
    SessionScheduleRepository,
    ...sessionScheduleProviders,
    DateUtil,
  ],
  exports: [SessionScheduleService],
})
export class SessionScheduleModule {}
