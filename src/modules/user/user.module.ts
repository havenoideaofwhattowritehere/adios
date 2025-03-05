import { forwardRef, Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../core/database/database.module';
import { Hash } from '../../shared/helpers/hash';
import { LoggerModule } from '../../shared/logging/logger.module';
import { ClubModule } from '../club/club.module';
import { ClubStudentModule } from '../club-student/club-student.module';
import { SessionModule } from '../session/session.module';
import { SessionScheduleModule } from '../session-schedule/session-schedule.module';
import { SessionInstanceModule } from '../session-instance/session-instance.module';
import { SessionParticipantModule } from '../session-participant/session-participant.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    forwardRef(() => ClubModule),
    forwardRef(() => ClubStudentModule),
    SessionModule,
    SessionScheduleModule,
    SessionInstanceModule,
    SessionParticipantModule,
    AttendanceModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...userProviders, Hash],
  exports: [UserService, UserRepository],
})
export class UserModule {}
