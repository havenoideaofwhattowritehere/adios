import { Module } from '@nestjs/common';

import { sessionInstanceProviders } from './entities/session-instance.entity';
import { SessionInstanceService } from './session-instance.service';
import { SessionInstanceController } from './session-instance.controller';
import { SessionInstanceRepository } from './session-instance.repository';
import { DateUtil } from '../../shared/common/utils/date/date.util';
import { DatabaseModule } from '../../core/database/database.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [DatabaseModule, AttendanceModule],
  controllers: [SessionInstanceController],
  providers: [
    SessionInstanceService,
    SessionInstanceRepository,
    ...sessionInstanceProviders,
    DateUtil,
  ],
  exports: [SessionInstanceService],
})
export class SessionInstanceModule {}
