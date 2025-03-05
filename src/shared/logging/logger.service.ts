import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { createLogger, ILogzioLogger } from 'logzio-nodejs';

@Injectable()
export class AppLogger extends ConsoleLogger implements LoggerService {
  private logzIo: ILogzioLogger;
  constructor() {
    super();
    this.logzIo = createLogger({
      token: process.env.LOGZIO_TOKEN,
      protocol: 'https',
      host: 'listener-uk.logz.io',
      port: '8071',
    });
    this.verbose('App logger started');
    this.logz_io('AppLogger check message.');
  }

  error(message: any, context?: string) {
    super.error(message, this.context);
  }

  log(message: any, context?: string) {
    super.log(message, this.context);
  }

  warn(message: any, context?: string) {
    super.warn(message, this.context);
  }

  debug(message: any, context?: string) {
    super.debug(message, this.context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, this.context);
  }

  logz_io(message: string, payload?: object): void {
    const ctx = this.context ? this.context : 'Logz.IO';
    try {
      this.verbose('=== Sending to Logz.IO START ===', ctx);
      this.logzIo.log(message, payload);
      this.verbose('=== Sending to Logz.IO END ===', ctx);
    } catch (e) {
      this.error(e);
    }
  }
}
