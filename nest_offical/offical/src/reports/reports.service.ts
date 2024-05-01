import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
  // constructor(
  //   @InjectRepository(Report) private reportRepository: Repository<Report>,
  // ) {}
  constructor(private readonly reportRepository: ReportsRepository) {}
  create(createReportDto: CreateReportDto) {
    const report = new Report();
    report.title = createReportDto.title;
    report.context = createReportDto.context;

    return this.reportRepository.customSave(report);
  }

  async allReport(): Promise<Report[]> {
    return this.reportRepository.findAll();
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
