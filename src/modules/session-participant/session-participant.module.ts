import { Module } from '@nestjs/common';

import { SessionParticipantController } from './session-participant.controller';
import { SessionParticipantService } from './session-participant.service';
import { sessionParticipantProviders } from './entities/session-participant.entity';
import { SessionParticipantRepository } from './session-participant.repository';
import { DatabaseModule } from '../../core/database/database.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [DatabaseModule, AttendanceModule],
  controllers: [SessionParticipantController],
  providers: [
    SessionParticipantService,
    SessionParticipantRepository,
    ...sessionParticipantProviders,
  ],
  exports: [SessionParticipantService],
})
export class SessionParticipantModule {}
