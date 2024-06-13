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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ReportsService } from 'src/reports/reports.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly reportsService: ReportsService,
  ) {}

  @Post()
  async create(
    // @Param('reportId') reportId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    const { reportId, content } = createCommentDto;
    const report = await this.reportsService.findOneByReportId(reportId);
    if (!report) {
      throw new NotFoundException('report가 존재하지 않습니다.');
    }
    return this.commentsService.create(createCommentDto, user, report);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('/:commentId')
  async findOne(@Param('commentId') commentId: number) {
    const comment =
      await this.commentsService.findCommentWithUserAndReport(commentId);
    if (!comment) {
      throw new NotFoundException('Comment가 존재하지 않습니다.');
    }
    return comment;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
