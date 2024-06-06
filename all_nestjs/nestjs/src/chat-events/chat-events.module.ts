import { forwardRef, Module } from '@nestjs/common';
import { ChatEventsGateway } from './chat-events.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ChatModule),
    RedisModule,
  ],
  providers: [ChatEventsGateway],
  exports: [ChatEventsGateway],
})
export class ChatEventsModule {}
