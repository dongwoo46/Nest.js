import { Test, TestingModule } from '@nestjs/testing';
import { SslService } from './ssl.service';

describe('SslService', () => {
  let service: SslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SslService],
    }).compile();

    service = module.get<SslService>(SslService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
