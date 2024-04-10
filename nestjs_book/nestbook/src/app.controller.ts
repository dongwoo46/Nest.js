import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor() {
    // EMAIL_SERVICE 환경 변수 출력
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    // EMAIL_AUTH_USER 환경 변수 출력
    console.log('EMAIL_AUTH_USER:', process.env.EMAIL_AUTH_USER);
    // EMAIL_AUTH_PASSWORD 환경 변수 출력
    console.log('EMAIL_AUTH_PASSWORD:', process.env.EMAIL_AUTH_PASSWORD);
    // EMAIL_BASE_URL 환경 변수 출력
    console.log('EMAIL_BASE_URL:', process.env.EMAIL_BASE_URL);
  }

  @Get()
  getHello(): string {
    console.log(process.env.NODE_ENV);
    return "sdfsd";
  }
}
