import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my-logger';
import { LoggerService } from './logger/logger.service';
import { RenewLogger } from './logger/renew-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'debug'],
    // logger: new MyLogger(), // 로거를 단순히 클래스로 제공할때
    bufferLogs: true,
  });
  // app.useLogger(app.get(LoggerService));
  app.useLogger(new RenewLogger());

  await app.listen(3000);
}
bootstrap();
