import { forwardRef, Module } from '@nestjs/common';

import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { sessionProviders } from './entities/session.entity';
import { ClubModule } from '../club/club.module';
import { SessionParticipantModule } from '../session-participant/session-participant.module';
import { SessionScheduleModule } from '../session-schedule/session-schedule.module';
import { DatabaseModule } from '../../core/database/database.module';
import { SessionInstanceModule } from '../session-instance/session-instance.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ClubModule),
    SessionParticipantModule,
    SessionScheduleModule,
    SessionInstanceModule,
    AttendanceModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, ...sessionProviders],
  exports: [SessionService],
})
export class SessionModule {}
