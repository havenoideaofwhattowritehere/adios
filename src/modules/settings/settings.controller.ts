import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('bot-link')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => String })
  getBotLink(): string {
    return this.settingsService.getBotLink();
  }
}
