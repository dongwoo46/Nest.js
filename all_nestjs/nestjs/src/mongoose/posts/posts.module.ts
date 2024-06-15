import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schemas/post.schema';
import { Member, MemberSchema } from '../schemas/member.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MemberModule } from '../members/members.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Member.name,
        schema: MemberSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
