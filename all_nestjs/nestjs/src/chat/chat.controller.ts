import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/public.decorator';
import { Chat } from './entities/chat.entity';
import { Request as expReq } from 'express';
import { Socket } from 'socket.io';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  create(@Body() createChatDto: CreateChatDto, @GetUser() user: User) {
    return this.chatService.createChat(createChatDto, user);
  }

  @Post('/join/:chatName')
  async joinChat(
    @Param('chatName') chatName: string,
    @GetUser() user: User,
  ): Promise<Chat> {
    return this.chatService.joinChat(chatName, user);
  }

  @Post('/leave/:chatName')
  async leaveChat(@Param('chatName') name: string, @GetUser() user: User) {
    // const client: Socket = req.app.get('io').sockets.sockets.get(user.socketId);
    // if (!client) {
    //   throw new NotFoundException('Client not found');
    // }

    const chat = await this.chatService.leaveChat(name, user);
    return { message: `User ${user.userId} left chat ${chat.chatId}` };
  }

  @Public()
  @Get()
  findAllChat() {
    return this.chatService.findAllChat();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: any) {
  //   return this.chatService.update(id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatService.remove(id);
  // }
}
