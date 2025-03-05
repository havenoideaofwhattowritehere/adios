import { forwardRef, Module } from '@nestjs/common';

import { ClubStudentService } from './club-student.service';
import { ClubStudentController } from './club-student.controller';
import { ClubStudentRepository } from './club-student.repository';
import { clubStudentProviders } from './entities/club-student.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../../core/auth/auth.module';
import { DatabaseModule } from '../../core/database/database.module';
import { SessionParticipantModule } from '../session-participant/session-participant.module';
import { ClubStaffModule } from '../club-staff/club-staff.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    DatabaseModule,
    SessionParticipantModule,
    ClubStaffModule,
    AttendanceModule
  ],
  controllers: [ClubStudentController],
  providers: [
    ClubStudentService,
    ClubStudentRepository,
    ...clubStudentProviders,
  ],
  exports: [ClubStudentService],
})
export class ClubStudentModule {}
