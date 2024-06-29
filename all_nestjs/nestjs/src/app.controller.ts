import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { FeatureService } from './feature/feature.service';

@Controller()
@Public()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly featureService: FeatureService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('increment-feature')
  // incrementFeatureCounter() {
  //   this.featureService.incrementFeatureCounter();
  //   return 'Feature counter incremented!';
  // }
}
