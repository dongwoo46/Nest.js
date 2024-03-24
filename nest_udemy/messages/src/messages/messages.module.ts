import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './message.service';
import { MessagesRepository } from './message.repository';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
