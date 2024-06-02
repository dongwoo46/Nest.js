import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ChatGuard } from './chat.guard';
import { WsGuard } from './ws.guard';
import { UsersService } from 'src/users/users.service';
import { SocketAuthMiddleware } from 'src/events/ws-jwt/ws.ms';
import { SocketAuthMiddleware2 } from './ws.middleware';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersSwervice: UsersService,
  ) {}

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware2() as any);
    console.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token);
    const user = await this.usersSwervice.findOneById(decoded.userId); // 사용자 정보 가져오기
    console.log('createChat gateway');
    console.log(token);
    console.log(user);
    const createChatDto = { name: data.name };
    const chat = await this.chatService.createChat(createChatDto, user);

    client.join(chat.chatId.toString());
    this.server.to(chat.chatId.toString()).emit('Chat Created', chat);
    return chat;
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.chatService.findRoomById(data.roomId);
    if (room) {
      client.join(room.id);
      this.server
        .to(room.id)
        .emit('userJoined', { userId: client.id, roomId: room.id });
      return room;
    }
    return { error: 'Room not found' };
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.chatService.findRoomById(data.roomId);
    if (room) {
      const chatMessage = this.chatService.addMessage(
        room.id,
        client.id,
        data.message,
      );
      this.server.to(room.id).emit('message', chatMessage);
      return chatMessage;
    }
    return { error: 'Room not found' };
  }
}
