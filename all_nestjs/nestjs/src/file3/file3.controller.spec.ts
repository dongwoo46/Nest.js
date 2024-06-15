import { Test, TestingModule } from '@nestjs/testing';
import { File3Controller } from './file3.controller';
import { File3Service } from './file3.service';

describe('File3Controller', () => {
  let controller: File3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [File3Controller],
      providers: [File3Service],
    }).compile();

    controller = module.get<File3Controller>(File3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
