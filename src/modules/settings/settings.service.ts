import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsService {
  constructor(private readonly configService: ConfigService) {}
  getBotLink(): string {
    return `${this.configService.get<string>('bot.link')}?start=`;
  }
}
