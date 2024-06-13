import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}
  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportRepository.create(createReportDto);
    report.user = user;
    return this.reportRepository.save(report);
  }

  findAll() {
    return this.reportRepository.find({ relations: ['user'] });
  }

  findOneByReportId(reportId) {
    return this.reportRepository.findOneBy({ reportId: reportId });
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
