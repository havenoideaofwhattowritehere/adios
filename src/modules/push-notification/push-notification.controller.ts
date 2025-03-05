import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PushNotificationService } from './push-notification.service';
import {
  CreatePushNotificationDto,
  KeyDto,
  MessageDto,
  WebPushResult,
} from './dto/create-push-notification.dto';

@ApiTags('Push-notification')
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('subscribe')
  subscribe(
    @Body() subscription: CreatePushNotificationDto,
  ): CreatePushNotificationDto {
    return this.pushNotificationService.addSubscription(subscription);
  }

  @Post('send')
  sendNotification(@Body() message: MessageDto): Promise<WebPushResult[]> {
    return this.pushNotificationService.sendNotificationsToAll(message);
  }
  @Get('key')
  getPublicKey(): KeyDto {
    return this.pushNotificationService.getPublicKey();
  }
}
