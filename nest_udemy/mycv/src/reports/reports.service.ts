import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable() //controller에서 의존성 주입을 위해 필요함
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make= :make', { make: estimateDto.make })
      .andWhere('model=:model', { model: estimateDto.model })
      .andWhere('lng-:lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat-:lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year-:year BETWEEN -3 AND 3', { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage - :mileage', 'DESC') // {estimateDto.mileage} 두번째 인자로 사용불가 orderBy는 두번째 인자가 파라미터가 아니라 내림차순 오름차순 선택임
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne(); // 서로 다른 여러 레코드를 구할때는 getRawMany() , 지금은 AVG 호출을 통해 모든 내용을 하나의 행으로 압축해서 getRawOne()
  }
}
