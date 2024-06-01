import { Test, TestingModule } from '@nestjs/testing';
import { EccSignService } from './ecc-sign.service';

describe('EccSignService', () => {
  let service: EccSignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EccSignService],
    }).compile();

    service = module.get<EccSignService>(EccSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
