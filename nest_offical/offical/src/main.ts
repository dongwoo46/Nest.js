import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my-logger';
import { LoggerService } from './logger/logger.service';
import { RenewLogger } from './logger/renew-logger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const app = await NestFactory.create(AppModule, {
  //   // logger: ['error', 'warn', 'debug'],
  //   // logger: new MyLogger(), // 로거를 단순히 클래스로 제공할때
  //   bufferLogs: true,
  // });
  app.enableCors({
    // cors 설정
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });
  // app.useLogger(app.get(LoggerService));
  // app.useLogger(new RenewLogger());
  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
