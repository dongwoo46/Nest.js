import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { ReportsService } from 'src/reports/reports.service';
import { Report } from 'src/reports/entities/report.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  create(createCommentDto: CreateCommentDto, user: User, report: Report) {
    console.log(user);
    const comment = this.commentRepository.create(createCommentDto);
    comment.report = report;
    comment.user = user;
    return this.commentRepository.save(comment);
  }

  findAll() {
    return this.commentRepository.find({
      relations: ['user', 'replies', 'report'],
    });
  }
  async findCommentWithUserAndReport(commentId: number): Promise<Comment> {
    return await this.commentRepository.findOne({
      where: { commentId: commentId },
      relations: ['user', 'report'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
