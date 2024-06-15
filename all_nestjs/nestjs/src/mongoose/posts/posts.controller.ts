import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { Public } from 'src/auth/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @Public()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }
}
