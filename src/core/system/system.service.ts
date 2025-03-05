import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';
import { AppLogger } from 'src/shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/shared/common/enum/environment.enum';

@Injectable()
export class SystemService
  implements OnApplicationShutdown, BeforeApplicationShutdown
{
  constructor(
    private logger: AppLogger,
    private config: ConfigService,
  ) {
    this.logger.setContext('SystemService');
    this.logger.verbose('System service started');
  }

  beforeApplicationShutdown(signal?: string): void {
    if (this.canRunInThisEnvironment()) {
      this.logger.logz_io(
        `Before application is shutting down with signal: ${signal}`,
      );
    } else {
      this.logger.error(
        `Before application is shutting down with signal: ${signal}`,
      );
    }
  }

  onApplicationShutdown(signal?: string): void {
    if (this.canRunInThisEnvironment()) {
      this.logger.logz_io(
        `Application is shutting down with signal: ${signal}`,
      );
    } else {
      this.logger.error(`Application is shutting down with signal: ${signal}`);
    }
  }

  canRunInThisEnvironment(env: Environment = Environment.DEVELOPMENT): boolean {
    return this.config.get('env') !== env;
  }
  currentEnv(): Environment {
    return this.config.get('env') as Environment;
  }
}
