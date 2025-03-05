import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

import { UUID } from '../../shared/common/interfaces/types';
import { BotMessages } from './tg-bot-api.messages';
import { BotOptions } from './tg-bot-api.options';
import { UserService } from '../user/user.service';
import { ClubService } from '../club/club.service';
import { ClubStudentService } from '../club-student/club-student.service';
import { ClubStaffService } from '../club-staff/club-staff.service';
import { DEFAULT_LANGUAGE } from '../../shared/common/constants/language';
import { StudentStatus } from '../club-student/entities/club-student.entity';
import { PhoneValidation } from '../../shared/common/utils/phone-validation/phone-vlidation';
import { AppLogger } from '../../shared/logging/logger.service';

@Injectable()
export class TgBotApiService implements OnApplicationBootstrap {
  constructor(
    private bot: TelegramBot,
    private readonly userService: UserService,
    private readonly clubService: ClubService,
    private readonly clubStudentService: ClubStudentService,
    private readonly clubStaffService: ClubStaffService,
    private readonly configService: ConfigService,
    private readonly botMessages: BotMessages,
    private readonly botOptions: BotOptions,
    private readonly phoneValidation: PhoneValidation,
    private readonly logger: AppLogger,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.bot = new TelegramBot(this.configService.get<string>('bot.token'));
    await this.bot.startPolling();
    await this.registration();
  }

  async validateForClub(clubId: UUID): Promise<string | boolean> {
    try {
      const result = await this.clubService.getClub(clubId);
      if (!result) {
        return false;
      }
      return result.name;
    } catch (err) {
      return false;
    }
  }

  async registration(): Promise<void> {
    this.bot.on('message', async (msg) => {
      const commandAndArgs = msg.text?.split(' ');
      if (commandAndArgs?.[0].toLowerCase() === '/start') {
        try {
          if (commandAndArgs?.[1]) {
            const args = commandAndArgs?.[1].split('_');
            const clubId = args[0];
            const lang = args[1] || DEFAULT_LANGUAGE;
            const club = await this.validateForClub(clubId);
            if (club) {
              await this.sendWelcomeMessage(msg, lang, club as string);
              this.bot.once('contact', async (msg) => {
                await this.sendContact(msg, lang, clubId);
              });
            } else {
              await this.bot.sendMessage(
                msg.from.id,
                this.botMessages.noClub(lang, clubId),
              );
            }
          } else {
            await this.bot.sendMessage(
              msg.from.id,
              this.botMessages.invalidStart(
                DEFAULT_LANGUAGE,
                msg.from.first_name,
              ),
            );
          }
        } catch (err) {
          this.logger.error(err);
          await this.bot.sendMessage(
            msg.from.id,
            this.botMessages.error(DEFAULT_LANGUAGE),
          );
        }
      }
    });
  }

  async sendWelcomeMessage(
    msg: TelegramBot.Message,
    lang: string,
    clubName: string,
  ): Promise<void> {
    await this.bot.sendMessage(
      msg.from.id,
      this.botMessages.start(lang, clubName, msg.from.first_name),
      await this.botOptions.credentials(lang),
    );
  }

  async sendContact(
    msg: TelegramBot.Message,
    lang: string,
    clubId: UUID,
    creds?: { firstName: string; lastName: string },
  ): Promise<void> {
    if (msg.contact) {
      if (!msg.contact.phone_number) {
        await this.bot
          .sendMessage(msg.from.id, this.botMessages.noPhoneNumber(lang), {
            reply_markup: {
              remove_keyboard: true,
            },
          })
          .then(() =>
            this.bot.once(
              'message',
              async (msg) =>
                await this.sendContact(msg, lang, clubId, {
                  firstName: msg.contact.first_name,
                  lastName: msg.contact.last_name,
                }),
            ),
          );
      } else {
        const phone = this.phoneValidation.formatPhoneNumber(
          msg.contact.phone_number,
        );
        if (!phone) {
          await this.bot
            .sendMessage(
              msg.from.id,
              this.botMessages.invalidPhoneNumber(
                lang,
                msg.contact.phone_number,
              ),
              {
                reply_markup: {
                  remove_keyboard: true,
                },
              },
            )
            .then(() =>
              this.bot.once(
                'message',
                async (msg) =>
                  await this.sendContact(msg, lang, clubId, {
                    firstName: msg.contact.first_name,
                    lastName: msg.contact.last_name,
                  }),
              ),
            );
        } else {
          await this.registerUser(msg, lang, clubId, phone, {
            firstName: msg.contact.first_name,
            lastName: msg.contact.last_name,
          });
        }
      }
    } else {
      const phone = this.phoneValidation.formatPhoneNumber(msg.text);
      if (!phone) {
        await this.bot
          .sendMessage(
            msg.from.id,
            this.botMessages.invalidPhoneNumber(lang, msg.text),
          )
          .then(() =>
            this.bot.once(
              'message',
              async (msg) =>
                await this.sendContact(msg, lang, clubId, {
                  firstName: msg.contact.first_name,
                  lastName: msg.contact.last_name,
                }),
            ),
          );
      } else {
        await this.registerUser(msg, lang, clubId, phone, creds);
      }
    }
  }

  async registerUser(
    msg: TelegramBot.Message,
    lang: string,
    clubId: UUID,
    phone: string,
    creds: { firstName: string; lastName: string },
  ): Promise<void> {
    try {
      const user = await this.userService.findUserByPhone(phone);
      if (user) {
        const student = await this.clubStudentService.getClubStudentByRecord(
          user.id,
          clubId,
        );
        const staff = await this.clubStaffService.getClubStaffByRecord(
          user.id,
          clubId,
        );
        const club = await this.clubService.getClub(clubId);
        if (student || staff) {
          if (user.clubsAsStaff.length + user.clubsAsStudent.length > 1) {
            await this.bot.sendMessage(
              msg.from.id,
              this.botMessages.welcomeBackVeteran(
                lang,
                club.name,
                user.firstName,
                user.clubsAsStaff.map((c) => c.name),
                user.clubsAsStudent.map((c) => c.name),
              ),
              {
                reply_markup: {
                  remove_keyboard: true,
                },
              },
            );
          } else {
            await this.bot.sendMessage(
              msg.from.id,
              this.botMessages.welcomeBack(lang, club.name, user.firstName),
              {
                reply_markup: {
                  remove_keyboard: true,
                },
              },
            );
          }
        } else {
          await this.bot.sendMessage(
            msg.from.id,
            this.botMessages.registeredInSystem(
              lang,
              club.name,
              user.firstName,
            ),
            {
              reply_markup: {
                remove_keyboard: true,
              },
            },
          );
          await this.clubStudentService.createClubStudent({
            userId: user.id,
            clubId,
            status: StudentStatus.ACTIVE,
          });
          const updatedUser = await this.userService.getUser(user.id);
          await this.bot.sendMessage(
            msg.from.id,
            this.botMessages.assignToClub(
              lang,
              club.name,
              updatedUser.clubsAsStaff.map((c) => c.name),
              updatedUser.clubsAsStudent.map((c) => c.name),
            ),
            {
              reply_markup: {
                remove_keyboard: true,
              },
            },
          );
        }
      } else {
        await this.validateRegistration(msg, lang, clubId, { phone, ...creds });
      }
    } catch (err) {
      this.logger.error(err);
      await this.bot.sendMessage(
        msg.from.id,
        this.botMessages.phoneValidationError(lang),
      );
    }
  }

  async validateRegistration(
    msg: TelegramBot.Message,
    lang: string,
    clubId: UUID,
    creds: { phone: string; firstName: string; lastName: string },
  ): Promise<void> {
    await this.bot
      .sendMessage(
        msg.from.id,
        this.botMessages.credentials(lang, creds),
        await this.botOptions.yesOrNo(lang),
      )
      .then(() => {
        this.bot.once('callback_query', async (callbackQuery) => {
          if (callbackQuery.data === 'yes') {
            try {
              await this.clubStudentService.registerStudentViaBot(
                {
                  ...creds,
                },
                clubId,
              );
              const club = await this.clubService.getClub(clubId);
              await this.bot.sendMessage(
                msg.from.id,
                this.botMessages.register(lang, club.name),
              );
            } catch (err) {
              this.logger.error(err);
              await this.bot.sendMessage(
                msg.from.id,
                this.botMessages.registrationError(lang),
              );
            }
          } else {
            await this.bot
              .sendMessage(msg.from.id, this.botMessages.name(lang))
              .then(() => {
                this.bot.once('message', async (msg) => {
                  const nameParts = msg.text.split(' ');
                  creds.firstName = nameParts[0];
                  creds.lastName = nameParts[1];
                  await this.validateRegistration(msg, lang, clubId, creds);
                });
              });
          }
        });
      });
  }
}
