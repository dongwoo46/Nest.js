import { Test, TestingModule } from '@nestjs/testing';
import { RsaSignService } from './rsa-sign.service';

describe('RsaSignService', () => {
  let service: RsaSignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RsaSignService],
    }).compile();

    service = module.get<RsaSignService>(RsaSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
