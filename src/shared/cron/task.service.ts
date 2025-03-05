import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { SessionInstanceService } from '../../modules/session-instance/session-instance.service';
import { SessionScheduleService } from '../../modules/session-schedule/session-schedule.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private readonly cronTime = process.env.CRON_TIME;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly sessionInstanceService: SessionInstanceService,
    private readonly sessionScheduleService: SessionScheduleService,
  ) {}

  onModuleInit() {
    this.scheduleDailySessionInstanceCreation();
  }

  scheduleDailySessionInstanceCreation() {
    const cronJob = new CronJob(this.cronTime, async () => {
      this.logger.log('Starting cron job for session instances creation...');

      try {
        const currentDate = new Date();

        const sessionSchedules =
          await this.sessionScheduleService.getTodaySchedules(currentDate);
        await this.sessionInstanceService.createSessionInstancesForToday(
          sessionSchedules,
          currentDate,
        );
        this.logger.log('Cron job finished successfully.');
      } catch (error) {
        this.logger.error(
          'Error occurred during session instances creation:',
          error,
        );
      }
    });

    this.schedulerRegistry.addCronJob(
      'daily-session-instance-creation',
      cronJob,
    );
    cronJob.start();
  }
}
