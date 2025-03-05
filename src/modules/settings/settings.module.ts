import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
