import { Injectable } from '@nestjs/common';

export interface Room {
  id: string;
  name: string;
  messages: { userId: string; message: string }[];
}

@Injectable()
export class ChatService {
  private rooms: Room[] = [];

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
