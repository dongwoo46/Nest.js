import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerMiddleware2 } from './middleware/logger2.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston/lib/winston/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/httpexception.filter';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './logging/logging.module';
import { BatchModule } from './batch/batch.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { DogHealthIndicator } from './health-check/dog.health';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DATABASE_HOST,
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'test',
      // entities: [__dirname + '/**/*.entitny{.ts,.js}'],
      entities: [UserEntity],
      synchronize: true,
    }),
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    AuthModule,
    LoggerModule,
    ExceptionModule,
    LoggingModule,
    BatchModule,
    HttpModule,
    TerminusModule,
  ],
  controllers: [HealthCheckController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    DogHealthIndicator,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware, LoggerMiddleware2).forRoutes('/users');
  }
}
