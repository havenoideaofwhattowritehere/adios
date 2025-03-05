import { Module } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

import { TgBotApiService } from './tg-bot-api.service';
import { BotMessages } from './tg-bot-api.messages';
import { BotOptions } from './tg-bot-api.options';
import { PhoneValidation } from '../../shared/common/utils/phone-validation/phone-vlidation';
import { UserModule } from '../user/user.module';
import { ClubModule } from '../club/club.module';
import { ClubStudentModule } from '../club-student/club-student.module';
import { ClubStaffModule } from '../club-staff/club-staff.module';
import { LoggerModule } from '../../shared/logging/logger.module';

@Module({
  imports: [
    UserModule,
    ClubModule,
    ClubStudentModule,
    ClubStaffModule,
    LoggerModule,
  ],
  providers: [
    TgBotApiService,
    TelegramBot,
    BotMessages,
    BotOptions,
    PhoneValidation,
  ],
  exports: [TgBotApiService],
})
export class TgBotApiModule {}
