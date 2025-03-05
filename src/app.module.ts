import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { validate } from './core/config/env.validation';
import { ClubModule } from './modules/club/club.module';
import { ClubStudentModule } from './modules/club-student/club-student.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SessionModule } from './modules/session/session.module';
import { PaymentTargetModule } from './modules/payment-target/payment-target.module';
import { ClubStaffModule } from './modules/club-staff/club-staff.module';
import { AuthModule } from './core/auth/auth.module';
import { SessionParticipantModule } from './modules/session-participant/session-participant.module';
import { SessionScheduleModule } from './modules/session-schedule/session-schedule.module';
import { SessionInstanceModule } from './modules/session-instance/session-instance.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ClubStudentSessionModule } from './modules/club-student-session/club-student-session.module';
import { ClubStudentSessionInstanceModule } from './modules/club-student-session-instance/club-student-session-instance.module';
import { LocationModule } from './modules/location/location.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PushNotificationModule } from './modules/push-notification/push-notification.module';
import { VersionModule } from './modules/version/version.module';
import { TgBotApiModule } from './modules/tg-bot-api/tg-bot-api.module';
import { TaskService } from './shared/cron/task.service';
import { DEFAULT_LANGUAGE } from './shared/common/constants/language';
import config from './config';
import { LoggerModule } from 'src/shared/logging/logger.module';
import { SystemModule } from 'src/core/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [() => config],
      isGlobal: true,
      validate,
    }),
    SystemModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: DEFAULT_LANGUAGE,
        loaderOptions: {
          path: join(__dirname, '../i18n/'),
          watch: true,
        },
        typesOutputPath: join(
          __dirname,
          '../src/core/generated/i18n.generated.ts',
        ),
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang']),
      ],
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        secure: true,
        port: process.env.EMAIL_PORT as unknown as number,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    LoggerModule,
    DatabaseModule,
    UserModule,
    ClubModule,
    ClubStaffModule,
    ClubStudentModule,
    PaymentModule,
    PaymentTargetModule,
    SessionModule,
    AuthModule,
    SessionParticipantModule,
    SessionScheduleModule,
    SessionInstanceModule,
    AttendanceModule,
    ClubStudentSessionModule,
    ClubStudentSessionInstanceModule,
    LocationModule,
    PushNotificationModule,
    VersionModule,
    TgBotApiModule,
    SettingsModule,
  ],
  providers: [TaskService],
})
export class AppModule {}
