import { Module } from '@nestjs/common';
import { EccSignService } from './ecc-sign.service';
import { EccSignController } from './ecc-sign.controller';

@Module({
  controllers: [EccSignController],
  providers: [EccSignService],
})
export class EccSignModule {}
