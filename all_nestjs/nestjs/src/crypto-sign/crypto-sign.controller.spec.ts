import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSignController } from './crypto-sign.controller';
import { CryptoSignService } from './crypto-sign.service';

describe('CryptoSignController', () => {
  let controller: CryptoSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoSignController],
      providers: [CryptoSignService],
    }).compile();

    controller = module.get<CryptoSignController>(CryptoSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
