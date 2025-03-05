import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

import { User } from '../../modules/user/entities/user.entity';
import { Club } from '../../modules/club/entities/club.entity';
import { ClubStaff } from '../../modules/club-staff/entities/club-staff.entity';
import { ClubStudent } from '../../modules/club-student/entities/club-student.entity';
import { Payment } from '../../modules/payment/entities/payment.entity';
import { Session } from '../../modules/session/entities/session.entity';
import { ClubStudentSession } from '../../modules/club-student-session/entities/club-student-session.entity';
import { PaymentTarget } from '../../modules/payment-target/entities/payment-target.entity';
import { SessionSchedule } from '../../modules/session-schedule/entities/session-schedule.entity';
import { SessionParticipant } from '../../modules/session-participant/entities/session-participant.entity';
import { Attendance } from '../../modules/attendance/entities/attendance.entity';
import { SessionInstance } from '../../modules/session-instance/entities/session-instance.entity';
import { ClubStudentSessionInstance } from '../../modules/club-student-session-instance/entities/club-student-session-instance.entity';
import { Location } from '../../modules/location/entities/location.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
      });
      sequelize.addModels([
        User,
        Club,
        ClubStaff,
        ClubStudent,
        Payment,
        SessionSchedule,
        SessionParticipant,
        Attendance,
        SessionInstance,
        ClubStudentSessionInstance,
        Session,
        PaymentTarget,
        ClubStudentSession,
        Location,
      ]);
      return sequelize;
    },
    inject: [ConfigService],
  },
];
