import { Module } from '@nestjs/common';
import { CryptoSignService } from './crypto-sign.service';
import { CryptoSignController } from './crypto-sign.controller';

@Module({
  controllers: [CryptoSignController],
  providers: [CryptoSignService],
})
export class CryptoSignModule {}
