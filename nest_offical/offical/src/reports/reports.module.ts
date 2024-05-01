import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { TypeOrmExModule } from './typeorm/typeorm-ex.module';
import { ReportsRepository } from './reports.repository';

@Module({
  // imports: [TypeOrmModule.forFeature([Report])],
  imports: [TypeOrmExModule.forCustomRepository([ReportsRepository])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
