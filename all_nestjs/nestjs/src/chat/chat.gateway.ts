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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    console.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.chatService.createRoom(data.name);
    client.join(room.id);
    this.server.to(room.id).emit('roomCreated', room);
    return room;
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
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

  @UseGuards(ChatGuard)
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
