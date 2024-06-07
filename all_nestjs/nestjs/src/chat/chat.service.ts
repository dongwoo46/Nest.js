import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chatMessage.entity';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service';
import { ChatEventsGateway } from 'src/chat-events/chat-events.gateway';
import { Socket } from 'dgram';
import { DuplicateEmailException } from 'src/exceptions/duplicate_email.exception';
import { DuplicateChatException } from 'src/exceptions/duplicate-chat.exception';

export interface Room {
  id: string;
  name: string;
  messages: { userId: string; message: string }[];
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    // private readonly chatEventsGateway: ChatEventsGateway,
  ) {}

  async createChat(createChatDto: CreateChatDto, user: User): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    chat.users = [user];

    await this.chatRepository.save(chat);
    return chat;
  }

  async joinChat(name: string, user: User): Promise<Chat> {
    const chat = await this.findChatByName(name);
    try {
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      if (!chat.users.some((u) => u.userId === user.userId)) {
        chat.users.push(user);
        await this.chatRepository.save(chat);
      }

      return chat;
    } catch (error) {
      console.error(`Error joining chat: ${error.message}`, {
        chatName: name,
        userId: user.userId,
      });
      throw error;
    }
  }

  async leaveChat(name: string, user: User): Promise<Chat> {
    const chat = await this.findChatByName(name);
    try {
      if (!chat) {
        throw new NotFoundException('채팅방을 찾을 수 없습니다.');
      }
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      // 유저가 이미 채팅방에 없는 경우 에러 던지기
      const userExists = chat.users.some((u) => u.userId === user.userId);
      if (!userExists) {
        throw new BadRequestException('유저가 이미 채팅방을 나간 상태입니다.');
      }

      chat.users = chat.users.filter((u) => u.userId !== user.userId);
      await this.chatRepository.save(chat);

      console.log(chat);
    } catch (err) {
      console.log(err);
      throw err; // 에러 다시 던지기
    }

    return chat;
  }

  async createChatMessage(name: string, user: User, message: string) {
    const chat = await this.findChatByName(name);
    // const chatMessage = this.chatMessagesRepository.create(message);
    // chatMessage.chat = chat;
    // chatMessage.user = user;

    // this.chatMessagesRepository.save(chatMessage);
    this.redisService.setCacheKey('message', message);
    return message;
  }

  findAllChat() {
    return this.chatRepository.find({ relations: ['users'] });
  }

  async findChatById(chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { chatId },
      relations: ['users'], // 'users' 관계를 로드하도록 설정
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async findChatByName(name: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { name },
      relations: ['users'], // 'users' 관계를 로드하도록 설정
    });

    return chat;
  }

  async checkChatName(name: string) {
    const chat = await this.findChatByName(name);
    if (chat) {
      throw new DuplicateChatException();
    }

    return true;
  }

  async checkUserInChat(userId: number, name: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const chat = await this.findChatByName(name);

    if (!chat) {
      throw new NotFoundException('채팅방이 존재하지 않습니다');
    }

    const isUserInChat = chat.users.some((u) => u.userId === userId);
    if (!isUserInChat) {
      throw new BadRequestException('유저가 채팅방에 가입되어 있지 않습니다.');
    }

    return true;
  }
  // addMessage(roomId: string, userId: string, message: string) {
  //   const room = this.chatRepository.find({ where: { roomId } });
  //   if (room) {
  //     const chatMessage = { userId, message };
  //     room.messages.push(chatMessage);
  //     return chatMessage;
  //   }
  //   return null;
  // }

  // findOne(id: string): Room | undefined {
  //   return this.findRoomById(id);
  // }

  // update(id: string, updateChatDto: any): Room | { error: string } {
  //   const room = this.findRoomById(id);
  //   if (room) {
  //     room.name = updateChatDto.name;
  //     return room;
  //   }
  //   return { error: 'Room not found' };
}

// remove(id: string): { success: boolean } | { error: string } {
//   const index = this.rooms.findIndex((room) => room.id === id);
//   if (index > -1) {
//     this.rooms.splice(index, 1);
//     return { success: true };
//   }
//   return { error: 'Room not found' };
// }
// }
