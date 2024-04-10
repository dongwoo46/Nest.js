import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log(process.env.NODE_ENV);
    console.log(this.configService.get('EMAIL_SERVICE'));
    return this.appService.getHello();
  }
}
