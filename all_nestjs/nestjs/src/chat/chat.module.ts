import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { RedisModule } from 'src/redis/redis.module';
import { ChatEventsGateway } from 'src/chat-events/chat-events.gateway';
import { ChatEventsModule } from 'src/chat-events/chat-events.module';

//npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMessage]),
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
    RedisModule,
    forwardRef(() => ChatEventsModule), // forwardRef로 ChatEventsModule 임포트
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
