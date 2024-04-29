import { Injectable, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/decorators/check-policies.decorator';
import { Article } from './entities/article.entity';
import { Action } from 'src/enums/action.enum';
import { ReadArticlePolicyHandler } from 'src/casl/read-article-policy.handler';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    const article = new Article();
    article.authorId = createArticleDto.authorId;
    article.context = createArticleDto.context;
    article.isPublished = createArticleDto.isPublished;
    return this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
