import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { TypeOrmConfig } from './configs/typeOrmConfig';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite', // db종류
    //   database: 'db.sqlite', //db이름
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
