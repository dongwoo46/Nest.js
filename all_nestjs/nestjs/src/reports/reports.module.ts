import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
@Module({
  imports: [TypeOrmModule.forFeature([Report]), UsersModule],
  controllers: [ReportsController],
  providers: [ReportsService, CaslAbilityFactory],
})
export class ReportsModule {}
