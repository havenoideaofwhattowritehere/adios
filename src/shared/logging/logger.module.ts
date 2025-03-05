import { Module } from '@nestjs/common';
import { AppLogger } from '../../shared/logging/logger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
