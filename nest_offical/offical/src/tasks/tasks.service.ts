import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { RenewLogger } from 'src/logger/renew-logger';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private rewnewLogger: RenewLogger) {
    this.rewnewLogger.setContext('TasksServices');
  }

  // @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the second is 45');
  }

  // @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  // @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

  // @Cron('10 * * * * *')
  testLogger() {
    this.rewnewLogger.customLog();
    this.rewnewLogger.warn('sdfsdfsdfsdf');
  }
}
