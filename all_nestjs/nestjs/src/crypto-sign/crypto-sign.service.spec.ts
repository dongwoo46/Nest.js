import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSignService } from './crypto-sign.service';

describe('CryptoSignService', () => {
  let service: CryptoSignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoSignService],
    }).compile();

    service = module.get<CryptoSignService>(CryptoSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
