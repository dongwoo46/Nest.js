import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true, // configModule을 어플리케이션 영역 전체에 사용한다고 명시(환경정보가 필요한 모든 곳에서-전역사용)
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRoot({
    //   keepConnectionAlive: true,
    // }), // db 마이그레이션 이용
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  // 파이프라인 글로벌 적용 방법
  providers: [
    AppService,
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

// 미들웨어 글로벌 적용
export class AppModule {
  // AppModule에서 ConfigService를 사용하려면 DI 필요
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')], // cookie암호화에 사용
        }),
      )
      .forRoutes('*'); // 전체 애플리케이션에 들어오는 모든 요청에 이 미들웨어를 적용시킴
  }
}
