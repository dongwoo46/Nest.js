import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from 'src/comments/comments.service';

@Controller('reply')
export class ReplyController {
  constructor(
    private readonly replyService: ReplyService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  async create(
    @Body() createReplyDto: CreateReplyDto,
    @CurrentUser() user: User,
  ) {
    const { parentId, content, commentId } = createReplyDto;
    const comment =
      await this.commentsService.findCommentWithUserAndReport(commentId);
    if (!comment) {
      throw new NotFoundException('comment가 없습니다.');
    }
    const parent = parentId
      ? await this.replyService.findOneByReplyId(parentId)
      : null;
    return this.replyService.create(createReplyDto, user, comment, parent);
  }

  @Get()
  findAll() {
    return this.replyService.findAll();
  }

  @Get('/:replyId')
  findOne(@Param('replyId') replyId: string) {
    return this.replyService.findOneByReplyId(replyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReplyDto: UpdateReplyDto) {
    return this.replyService.update(+id, updateReplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replyService.remove(+id);
  }
}
