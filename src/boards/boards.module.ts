import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

// spring 생성자 주입
@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
