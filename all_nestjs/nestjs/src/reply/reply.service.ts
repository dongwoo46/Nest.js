import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async create(
    createReplyDto: CreateReplyDto,
    user: User,
    comment: Comment,
    parent?: Reply,
  ): Promise<Reply> {
    const reply = this.replyRepository.create(createReplyDto);
    reply.user = user;
    reply.comment = comment;
    if (parent) {
      reply.parent = parent;
    }
    return this.replyRepository.save(reply);
  }

  async findOneByReplyId(replyId) {
    return this.replyRepository.findOne({
      where: { replyId: replyId },
      relations: ['user', 'comment', 'childReplies', 'parent'],
    });
  }

  findAll() {
    return `This action returns all reply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  update(id: number, updateReplyDto: UpdateReplyDto) {
    return `This action updates a #${id} reply`;
  }

  remove(id: number) {
    return `This action removes a #${id} reply`;
  }
}
