import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [BoardsModule, TypeOrmModule.forRoot(typeORMConfig)],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
