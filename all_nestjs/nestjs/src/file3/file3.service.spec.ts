import { Test, TestingModule } from '@nestjs/testing';
import { File3Service } from './file3.service';

describe('File3Service', () => {
  let service: File3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [File3Service],
    }).compile();

    service = module.get<File3Service>(File3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
