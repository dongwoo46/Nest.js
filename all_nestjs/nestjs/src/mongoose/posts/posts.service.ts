import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from 'src/mongoose/schemas/post.schema';
import { Member } from 'src/mongoose/schemas/member.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.memberModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    const newPost = new this.postModel({ ...createPostDto, user: userId });
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });
    return savedPost;
  }

  findPostById() {}
}
