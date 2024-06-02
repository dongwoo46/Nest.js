import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/public.decorator';
import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  create(@Body() createChatDto: CreateChatDto, @GetUser() user: User) {
    return this.chatService.createChat(createChatDto, user);
  }

  @Post('/join/:chatId')
  async joinChat(
    @Param('chatId', ParseIntPipe) chatId: number,
    @GetUser() user: User,
  ): Promise<Chat> {
    return this.chatService.joinChat(chatId, user);
  }

  @Public()
  @Get()
  findAllChat() {
    return this.chatService.findAllChat();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: any) {
    return this.chatService.update(id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
