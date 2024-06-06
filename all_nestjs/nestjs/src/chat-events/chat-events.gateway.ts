import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from './ws/ws.guard';
import { SocketAuthMiddleware2 } from './ws/ws.middleware';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';
import { ChatGuard } from './ws/chat.guard';

@UseGuards(ChatGuard)
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private chatRooms: { [key: string]: Set<string> } = {};

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
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
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findOneById(client['user'].userId); // 사용자 정보 가져오기
    this.chatService.checkChatName(name);
    if (!this.chatRooms[name]) {
      this.chatRooms[name] = new Set();
    }
    const createChatDto = { name: name };
    const chat = await this.chatService.createChat(createChatDto, user);

    client.join(name);
    this.chatRooms[name].add(client.id);
    this.server.to(name).emit('chatCreated', { name });
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findOneById(client['user'].userId); // 사용자 정보 가져오기
    const chat = this.chatService.findChatByName(name);
    if (!user) {
      throw new NotFoundException('유저가 없어');
    }
    if (!chat) {
      throw new NotFoundException('채팅방이 없다.');
    }
    if (this.chatRooms[name]) {
      client.join(name);
      client.data.nickname = user.username;
      this.chatRooms[name].add(client.id);
      this.chatService.joinChat(name, user);
      this.server
        .to(name)
        .emit('userJoin', { name, user: user, clientId: client.id });
    } else {
      client.emit('error', { message: '채팅방이 존재하지 않는다.' });
    }
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findOneById(client['user'].userId);
    if (this.chatRooms[name]) {
      client.leave(name);
      this.chatRooms[name].delete(client.id);

      this.server.to(name).emit('userLeft', {
        name,
        user: user,
        message: `${user.username}가 채팅방을 떠났습니다.`,
      });

      this.chatService.leaveChat(name, user);
    }
    console.log(`${user.username}가 채팅방을 떠났습니다.`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: { name: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { name, message } = data;

    const user = await this.usersService.findOneById(client['user'].userId);

    this.server.to(name).emit('message', message);
  }

  //채팅방 목록 가져오기
  @SubscribeMessage('getChatRoomList')
  getChatRoomList(client: Socket, payload: any) {
    client.emit('getChatRoomList', this.chatService.findAllChat());
  }
}
