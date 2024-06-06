import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import configuration from './config/configuration';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { FileModule } from './file/file.module';
import { File2Module } from './file2/file2.module';
import { File2Controller } from './file2/file2.controller';
import { CaslModule } from './casl/casl.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SseModule } from './sse/sse.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EccSignModule } from './ecc-sign/ecc-sign.module';
import { RsaSignModule } from './rsa-sign/rsa-sign.module';
import { CryptoSignModule } from './crypto-sign/crypto-sign.module';
import * as redisStore from 'cache-manager-redis-store';
import { ChatModule } from './chat/chat.module';
// import { ChatGateway } from './chat/chat.gateway';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { WsJwtGuard } from './events/ws-jwt/ws-jwt.guard';
import { ChatEventsModule } from './chat-events/chat-events.module';
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await databaseConfig(configService),
    }),
    FileModule,
    File2Module,
    CaslModule,
    LoggerModule,
    // 단순 캐시만 사용할때
    // CacheModule.register({
    //   ttl: 100000, // 시간(밀리초)
    //   max: 10, // 캐시에 담길 최대 데이터 개수
    //   isGlobal: true, // 캐시모듈을 전역설정
    // }),

    //Redis 사용 - npm i chache-manger-redis-store
    CacheModule.register({
      max: 100,
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),

    SseModule,
    EventEmitterModule.forRoot(),
    EccSignModule,
    RsaSignModule,
    CryptoSignModule,
    ChatModule,
    EventsModule,
    MessagesModule,
    ChatEventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      //app모듈에 글로벌 파이프 적용,
      provide: APP_PIPE,
      // app 모듈 인스턴스르 만들때마다 애플리케이션에 들어오는 모든 요청을 이 클래스의 인스턴스를 이용해 처리
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true, // dto에 정의된 필드 유형이 일치하지 않으면 자동으로 타입변환 수행 ex) 전송된 문자 숫자로 변환
        transformOptions: {
          enableImplicitConversion: true, // 문자열에서 숫자 불리언 또는 배열로 암시적변환 가능 ex) 문자열 "10"은 number타입으로 자동 변환
        },
      }),
    },
  ],
})
export class AppModule {}
