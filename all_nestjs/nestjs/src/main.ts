import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './logger/my-logger.service';
import { MyLogger } from './logger/my-logger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { EventsGateway } from './events/events.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 의존성 주입 사용 불가 단순히 클래스만 넣어주는 것
    // logger: new MyLogger(),

    // 사용자 정의 로그가 첨부될때까지 기다리는 것 처음부터 사용자정의 로거 사용
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // nest에서 사용할 로거의 인스턴스를 주입(싱글톤) ->
  // 다른곳에서   private readonly logger = new Logger(MyService.name); 이렇게 써줘야함
  // app.useLogger(app.get(MyLogger));

  //처음부터 윈스턴 로그 쓰기
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Passport 초기화
  app.use(passport.initialize());

  // express-session 필요함
  // app.use(passport.session());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://127.0.0.1:5500', // 정확한 출처를 명시
    credentials: true, // 쿠키를 포함한 요청을 허용
  });

  // 2초마다 메시지 보내는 것
  // const eventGateway = app.get(EventsGateway);
  // setInterval(() => eventGateway.sendMessage(), 2000);
  await app.listen(3000);
}
bootstrap();
