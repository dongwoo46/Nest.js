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
    console.log(this.chatRooms);
    this.server.emit('chatCreated', {
      name,
      message: '채팅방이 생성되었습니다.',
    });
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findOneById(client['user'].userId); // 사용자 정보 가져오기
    const chat = await this.chatService.findChatByName(name);

    if (!user) {
      throw new NotFoundException('유저가 없어');
    }
    if (!chat) {
      client.emit('error', { message: '채팅방이 존재하지 않는다.' });
      throw new NotFoundException('채팅방이 없다.');
    }

    client.join(name);
    client.data.nickname = user.username;
    this.chatService.joinChat(name, user);
    this.server
      .to(name)
      .emit('userJoin', { name, user: user, clientId: client.id });
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findOneById(client['user'].userId);

    // 클라이언트가 방에 있는지 확인
    const rooms = Array.from(client.rooms);
    console.log('Current rooms:', rooms, client.id);

    // 클라이언트가 방을 떠나기 전에 메시지 전송
    this.server.to(name).emit('userLeft', {
      name,
      user: user,
      message: `${user.username}가 채팅방을 떠났습니다.`,
    });

    // 클라이언트가 방을 떠남
    client.leave(name);

    // 서버 전체에 유저가 떠났음을 알림
    this.server.emit('userLeft', { message: '유저가 채팅방을 떠났습니다.' });

    // 채팅 서비스에서 유저를 방에서 제거
    await this.chatService.leaveChat(name, user);

    console.log(`${user.username}가 채팅방을 떠났습니다.`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: { name: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { name, message } = data;
    console.log(data);
    try {
      // 사용자를 찾기
      const user = await this.usersService.findOneById(client['user'].userId);

      // 사용자가 방에 있는지 확인
      this.chatService.checkUserInChat(user.userId, name);

      const rooms = Array.from(client.rooms);
      if (!rooms.includes(name)) {
        throw new Error('사용자가 해당 방에 있지 않습니다.');
      }

      this.chatService.createChatMessage(name, user, message);
      // 메시지를 해당 방에 전송
      this.server.to(name).emit('message', {
        user: user.username,
        message: message,
      });

      this.server.emit('message', {
        user: user.username,
        message: message,
      });

      console.log(
        `${user.username}가 ${name} 방에 메시지를 전송했습니다: ${message}`,
      );
    } catch (err) {
      console.error(err);
      client.emit('error', '메시지를 전송할 수 없습니다.');
    }
  }

  //채팅방 목록 가져오기
  @SubscribeMessage('getChatRoomList')
  async getChatRoomList(client: Socket, payload: any) {
    const chats = await this.chatService.findAllChat();
    client.emit('getChatRoomList', chats);
  }
}
