import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMap } from '@src/shared/common/utils/response/error.map';
import { ConfigService } from '@nestjs/config';
import * as webPush from 'web-push';

import {
  CreatePushNotificationDto,
  KeyDto,
  MessageDto,
  WebPushResult,
} from './dto/create-push-notification.dto';

const vapidKeys = webPush.generateVAPIDKeys();

@Injectable()
export class PushNotificationService {
  private subscriptions: CreatePushNotificationDto[] = [];
  constructor(private readonly configService: ConfigService) {
    webPush.setVapidDetails(
      this.configService.get<string>('vapid_key.subject'),
      vapidKeys.publicKey,
      vapidKeys.privateKey,
    );
  }

  addSubscription(
    subscription: CreatePushNotificationDto,
  ): CreatePushNotificationDto {
    const isExistingSubscription = this.subscriptions.some(
      (sub) => sub.endpoint === subscription.endpoint,
    );

    if (!isExistingSubscription) {
      this.subscriptions.push(subscription);
    }

    return subscription;
  }

  async sendNotification(
    subscription: CreatePushNotificationDto,
    data: MessageDto,
  ): Promise<WebPushResult> {
    const notification = await webPush.sendNotification(
      subscription,
      JSON.stringify(data),
    );

    if (!notification) {
      throw new BadRequestException(ErrorMap.SERVER_ERROR);
    }

    return notification;
  }

  sendNotificationsToAll(message: MessageDto): Promise<WebPushResult[]> {
    const promises = this.subscriptions.map((subscription) =>
      this.sendNotification(subscription, message),
    );

    return Promise.all(promises);
  }

  getPublicKey(): KeyDto {
    return { key: vapidKeys.publicKey };
  }
}
