import { Test, TestingModule } from '@nestjs/testing';
import { File2Controller } from './file2.controller';

describe('File2Controller', () => {
  let controller: File2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [File2Controller],
    }).compile();

    controller = module.get<File2Controller>(File2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
