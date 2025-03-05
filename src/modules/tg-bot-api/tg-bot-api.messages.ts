import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BotMessages {
  constructor(private readonly i18n: I18nService) {}

  start(lang: string, clubName: string, firstName: string): string {
    return this.i18n.t(`${lang}.bot.messages.start`, {
      lang: lang,
      args: { clubName: clubName, firstName: firstName },
    });
  }
  invalidStart(lang: string, firstName: string): string {
    return this.i18n.t(`${lang}.bot.messages.invalidStart`, {
      lang: lang,
      args: { firstName: firstName },
    });
  }
  noClub(lang: string, clubId: string): string {
    return this.i18n.t(`${lang}.bot.messages.noClub`, {
      lang: lang,
      args: { clubId: clubId },
    });
  }
  noPhoneNumber(lang: string): string {
    return this.i18n.t(`${lang}.bot.messages.noPhoneNumber`, { lang: lang });
  }
  invalidPhoneNumber(lang: string, phone: string): string {
    return this.i18n.t(`${lang}.bot.messages.invalidPhoneNumber`, {
      lang: lang,
      args: { phone: phone },
    });
  }
  welcomeBack(lang: string, clubName: string, firstName: string): string {
    return this.i18n.t(`${lang}.bot.messages.welcomeBack`, {
      lang: lang,
      args: { clubName: clubName, firstName: firstName },
    });
  }
  welcomeBackVeteran(
    lang: string,
    clubName: string,
    firstName: string,
    staffClubNames: string[],
    studentClubNames: string[],
  ): string {
    return (
      this.i18n.t(`${lang}.bot.messages.welcomeBackVeteran`, {
        lang: lang,
        args: { clubName: clubName, firstName: firstName },
      }) + this.getClubs(lang, staffClubNames, studentClubNames)
    );
  }
  registeredInSystem(
    lang: string,
    clubName: string,
    firstName: string,
  ): string {
    return this.i18n.t(`${lang}.bot.messages.registeredInSystem`, {
      lang: lang,
      args: { clubName: clubName, firstName: firstName },
    });
  }
  credentials(
    lang: string,
    creds: {
      phone: string;
      firstName: string;
      lastName: string;
    },
  ): string {
    return this.i18n.t(`${lang}.bot.messages.credentials`, {
      lang: lang,
      args: creds,
    });
  }
  register(lang: string, clubName: string): string {
    return this.i18n.t(`${lang}.bot.messages.register`, {
      lang: lang,
      args: { clubName: clubName },
    });
  }
  assignToClub(
    lang: string,
    clubName: string,
    staffClubNames: string[],
    studentClubNames: string[],
  ): string {
    return (
      this.i18n.t(`${lang}.bot.messages.assignToClub`, {
        lang: lang,
        args: { clubName: clubName },
      }) + this.getClubs(lang, staffClubNames, studentClubNames)
    );
  }
  name(lang: string): string {
    return this.i18n.t(`${lang}.bot.messages.name`, {
      lang: lang,
    });
  }
  error(lang: string): string {
    return this.i18n.t(`${lang}.bot.errors.error`, {
      lang: lang,
    });
  }
  phoneValidationError(lang: string): string {
    return this.i18n.t(`${lang}.bot.errors.phoneValidationError`, {
      lang: lang,
    });
  }
  registrationError(lang: string): string {
    return this.i18n.t(`${lang}.bot.errors.registrationError`, {
      lang: lang,
    });
  }
  getClubs(
    lang: string,
    staffClubNames: string[],
    studentClubNames: string[],
  ): string {
    const coach = this.i18n.t(`${lang}.bot.messages.coach`, {
      lang: lang,
    });
    return (
      (staffClubNames.length > 0
        ? '\n• ' + staffClubNames.join(` ( ${coach} )\n• `) + ` ( ${coach} )`
        : '') +
      (studentClubNames.length > 0
        ? '\n• ' + studentClubNames.join('\n• ')
        : '')
    );
  }
}
