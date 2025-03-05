import { Module } from '@nestjs/common';
import { SystemService } from 'src/core/system/system.service';
import { LoggerModule } from 'src/shared/logging/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
