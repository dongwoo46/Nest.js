import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from './types/events';
import { Message } from 'src/messages/entities/message.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from './ws-jwt/ws.ms';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'events' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;
  private readonly logger = new Logger(EventsGateway.name);

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    this.logger.log('afterInit');
    console.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  sendMessage(message: Message) {
    console.log('Sending message:', message);
    this.server.emit('newMessage', message);
    console.log('Message sent.');
  }
}
