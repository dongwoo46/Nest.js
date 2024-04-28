import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { RenewLogger } from './renew-logger';

@Module({
  providers: [LoggerService, RenewLogger],
  exports: [LoggerService, RenewLogger],
})
export class LoggerModule {}
