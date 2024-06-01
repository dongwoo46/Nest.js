import { Module } from '@nestjs/common';
import { RsaSignService } from './rsa-sign.service';
import { RsaSignController } from './rsa-sign.controller';

@Module({
  controllers: [RsaSignController],
  providers: [RsaSignService],
})
export class RsaSignModule {}
