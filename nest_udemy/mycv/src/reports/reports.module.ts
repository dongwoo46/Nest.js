import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), UsersModule],
  controllers: [ReportsController],
  providers: [ReportsService], //의존성 주입하려면 provider에 있어야함
})
export class ReportsModule {}
