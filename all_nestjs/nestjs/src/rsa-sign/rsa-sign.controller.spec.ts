import { Test, TestingModule } from '@nestjs/testing';
import { RsaSignController } from './rsa-sign.controller';
import { RsaSignService } from './rsa-sign.service';

describe('RsaSignController', () => {
  let controller: RsaSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RsaSignController],
      providers: [RsaSignService],
    }).compile();

    controller = module.get<RsaSignController>(RsaSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
