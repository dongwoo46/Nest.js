import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Logger } from 'winston';
import { HttpExceptionFilter } from './httpexception.filter';

@Module({
  providers: [Logger, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class ExceptionModule {}
