import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './middleware/logger3.middleware';
import { AuthGuard } from './guard/auth.guard';
import { MyLogger } from './logger/my.logger';
import { HttpExceptionFilter } from './exception/httpexception.filter';
import { LoggingInterceptor } from './interceptor/loggin.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.use(logger3);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalGuards(new AuthGuard());
  app.useLogger(app.get(MyLogger));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
