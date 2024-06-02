import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { EventsModule } from 'src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    EventsModule, // EventsModule 추가
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
