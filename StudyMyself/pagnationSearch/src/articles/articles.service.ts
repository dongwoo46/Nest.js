import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    // const article = new Article();
    // article.context = createArticleDto.context;
    // article.title = createArticleDto.title;

    return this.articleRepository.save(createArticleDto);
  }

  async paginate(page: number = 1, take: number = 5): Promise<any> {
    // take=> limit, skip => offset - take 몇개의 데이터를 가지고 올것인가 , skip = 몇번재에 있는 데이터를 take만큼 가지고 올 것 인가?
    const [articles, total] = await this.articleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  findAll() {
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
