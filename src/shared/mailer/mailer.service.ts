import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { ErrorMap } from '../common/utils/response/error.map';
import {
  IMailOptions,
  IMailTemplate,
} from '../common/interfaces/mailer/mailer.interface';
import { TEMPLATES } from './mailer.templates';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  getTemplateByToken(token: string, langCode: string): Promise<IMailTemplate> {
    return TEMPLATES[token][langCode];
  }

  async sendMail(mailOptions: IMailOptions, template: IMailTemplate) {
    try {
      if (!mailOptions.to && !mailOptions.targets) {
        throw new Error(ErrorMap.CANNOT_SEND_EMAIL);
      }

      if (mailOptions.to) {
        return this.mailerService.sendMail({
          from: process.env.EMAIL_FROM,
          to: mailOptions.to,
          subject: template.subject,
          html: template.html,
        });
      }

      if (mailOptions.targets) {
        const sentMailResults = [];
        mailOptions.targets.forEach(async (to) => {
          sentMailResults.push(
            await this.mailerService.sendMail({
              from: process.env.EMAIL_FROM,
              to: to,
              subject: template.subject,
              html: template.html,
            }),
          );
        });
        return sentMailResults;
      }
    } catch (error) {
      throw new Error(ErrorMap.CANNOT_SEND_EMAIL);
    }
  }
}
