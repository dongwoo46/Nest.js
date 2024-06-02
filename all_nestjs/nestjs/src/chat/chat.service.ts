import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chatMessage.entity';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';

export interface Room {
  id: string;
  name: string;
  messages: { userId: string; message: string }[];
}

@Injectable()
export class ChatService {
  private rooms: Room[] = [];
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  async createChat(createChatDto: CreateChatDto, user: User): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    chat.users = [user];

    await this.chatRepository.save(chat);
    return chat;
  }

  async joinChat(chatId: number, user: User): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { chatId },
      relations: ['users'],
    });
    console.log(chat);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    console.log(user);
    if (!chat.users.some((u) => u.userId === user.userId)) {
      chat.users.push(user);
      await this.chatRepository.save(chat);
    }

    return chat;
  }

  findAllChat() {
    return this.chatRepository.find({ relations: ['users'] });
  }

  createRoom(name: string): Room {
    const room: Room = { id: Date.now().toString(), name, messages: [] };
    this.rooms.push(room);
    return room;
  }

  findRoomById(id: string): Room | undefined {
    return this.rooms.find((room) => room.id === id);
  }

  addMessage(roomId: string, userId: string, message: string) {
    const room = this.findRoomById(roomId);
    if (room) {
      const chatMessage = { userId, message };
      room.messages.push(chatMessage);
      return chatMessage;
    }
    return null;
  }

  create(createChatDto: any): Room {
    return this.createRoom(createChatDto.name);
  }

  findAll(): Room[] {
    return this.rooms;
  }

  findOne(id: string): Room | undefined {
    return this.findRoomById(id);
  }

  update(id: string, updateChatDto: any): Room | { error: string } {
    const room = this.findRoomById(id);
    if (room) {
      room.name = updateChatDto.name;
      return room;
    }
    return { error: 'Room not found' };
  }

  remove(id: string): { success: boolean } | { error: string } {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index > -1) {
      this.rooms.splice(index, 1);
      return { success: true };
    }
    return { error: 'Room not found' };
  }
}
