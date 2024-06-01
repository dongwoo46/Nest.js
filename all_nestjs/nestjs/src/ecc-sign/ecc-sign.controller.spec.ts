import { Test, TestingModule } from '@nestjs/testing';
import { EccSignController } from './ecc-sign.controller';
import { EccSignService } from './ecc-sign.service';

describe('EccSignController', () => {
  let controller: EccSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EccSignController],
      providers: [EccSignService],
    }).compile();

    controller = module.get<EccSignController>(EccSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
