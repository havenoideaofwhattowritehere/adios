import { Module } from '@nestjs/common';

import { ClubStudentSessionService } from './club-student-session.service';
import { ClubStudentSessionController } from './club-student-session.controller';
import { ClubStudentSessionRepository } from './club-student-session.repository';
import { clubStudentSessionProviders } from './entities/club-student-session.entity';

@Module({
  controllers: [ClubStudentSessionController],
  providers: [
    ClubStudentSessionService,
    ClubStudentSessionRepository,
    ...clubStudentSessionProviders,
  ],
  exports: [ClubStudentSessionService],
})
export class ClubStudentSessionModule {}
