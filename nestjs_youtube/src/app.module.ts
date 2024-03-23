import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '../config/typeorm.config';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BoardsModule, TypeOrmModule.forRoot(typeORMConfig), AuthModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
