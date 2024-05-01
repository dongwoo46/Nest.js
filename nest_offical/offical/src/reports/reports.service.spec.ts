import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { Logger } from '@nestjs/common';

describe('ReportsService', () => {
  let service: ReportsService;
  let repository: ReportsRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: ReportsRepository,
          useValue: {
            customSave: jest.fn(),
            findAll: jest.fn(),
          },
        },
        Logger, // Logger를 providers에 추가
      ],
    }).compile();

    logger = module.get<Logger>(Logger);
    service = module.get<ReportsService>(ReportsService);
    repository = module.get<ReportsRepository>(ReportsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a report', async () => {
      const createReportDto: CreateReportDto = {
        title: 'Test Report',
        context: 'This is a test report',
      };
      const mockReport = new Report();
      mockReport.id = 1;
      mockReport.title = createReportDto.title;
      mockReport.context = createReportDto.context;

      jest.spyOn(repository, 'customSave').mockResolvedValue(mockReport);

      const result = await service.create(createReportDto);
      // expect(repository.customSave).toHaveBeenCalledWith(mockReport);
      expect(result).toEqual(mockReport);
    });
  });

  describe('allReport', () => {
    it('should return all reports', async () => {
      const mockReports: Report[] = [
        { id: 1, title: 'Report 1', context: 'Context 1' },
        { id: 2, title: 'Report 2', context: 'Context 2' },
      ];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockReports);

      const result = await service.allReport();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockReports);
    });
  });

  describe('findAll', () => {
    it('should return a message', () => {
      const result = service.findAll();
      expect(result).toEqual('This action returns all reports');
    });
  });
});
