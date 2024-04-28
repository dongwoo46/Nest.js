import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RenewLogger } from 'src/logger/renew-logger';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [TasksService],
  imports: [LoggerModule],
})
export class TasksModule {}
