import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), CommentsModule],
  exports: [ReplyService],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
