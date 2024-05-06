import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my-logger';
import { LoggerService } from './logger/logger.service';
import { RenewLogger } from './logger/renew-logger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

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
  // somewhere in your initialization file
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  );

  const configService = app.get(ConfigService);
  const host = configService.get('DATABASE_HOST') || 3000;
  await app.listen(3000);
  Logger.log(`Application running on port ${host}`);
}
bootstrap();
