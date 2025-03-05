import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BotOptions {
  constructor(private readonly i18n: I18nService) {}

  async credentials(lang: string) {
    return {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: this.i18n.t(`${lang}.bot.options.credentials.send`, {
                lang: lang,
              }),
              request_contact: true,
            },
          ],
          [
            {
              text: this.i18n.t(`${lang}.bot.options.credentials.cancel`, {
                lang: lang,
              }),
              request_contact: false,
            },
          ],
        ],
      },
    };
  }

  async yesOrNo(lang: string) {
    return {
      reply_markup: {
        one_time_keyboard: true,
        inline_keyboard: [
          [
            {
              text: this.i18n.t(`${lang}.bot.options.yesOrNo.yes`, {
                lang: lang,
              }),
              callback_data: 'yes',
            },
            {
              text: this.i18n.t(`${lang}.bot.options.yesOrNo.no`, {
                lang: lang,
              }),
              callback_data: 'no',
            },
          ],
        ],
      },
    };
  }
}
