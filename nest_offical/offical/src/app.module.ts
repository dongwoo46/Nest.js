import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UploadsModule } from './uploads/uploads.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Report } from './reports/entities/report.entity';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [databaseConfig],
      envFilePath: [
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      ],
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      expandVariables: true, // 환경변수 확장 허용
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await databaseConfig(configService),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '1234',
    //   database: 'new',
    //   entities: [User, Article, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    UploadsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    LoggerModule,
    EventEmitterModule.forRoot(),
    UploadsModule,
    AuthModule,
    CaslModule,
    ArticleModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})

//EntityManager 객체 프로젝트 전체 주입
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
function typeORMConfig(
  configService: ConfigService<Record<string, unknown>, false>,
):
  | import('@nestjs/typeorm').TypeOrmModuleOptions
  | PromiseLike<import('@nestjs/typeorm').TypeOrmModuleOptions> {
  throw new Error('Function not implemented.');
}
