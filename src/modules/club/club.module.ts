import { forwardRef, Module } from '@nestjs/common';

import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { ClubRepository } from './club.repository';
import { clubProviders } from './entities/club.entity';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../core/database/database.module';
import { SessionModule } from '../session/session.module';
import { SessionScheduleModule } from '../session-schedule/session-schedule.module';
import { SessionInstanceModule } from '../session-instance/session-instance.module';
import { ClubStudentModule } from '../club-student/club-student.module';
import { SessionParticipantModule } from '../session-participant/session-participant.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    forwardRef(() => SessionModule),
    SessionScheduleModule,
    SessionInstanceModule,
    forwardRef(() => ClubStudentModule),
    SessionParticipantModule,
    AttendanceModule,
  ],
  controllers: [ClubController],
  providers: [ClubService, ClubRepository, ...clubProviders],
  exports: [ClubService],
})
export class ClubModule {}
