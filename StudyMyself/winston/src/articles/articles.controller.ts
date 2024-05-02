import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {}

  private printWinstonLog(dto) {
    this.winstonLogger.error('error: ', dto);
    this.winstonLogger.warn('warn: ', dto);
    this.winstonLogger.info('info: ', dto);
    this.winstonLogger.http('http: ', dto);
    this.winstonLogger.verbose('verbose: ', dto);
    this.winstonLogger.debug('debug: ', dto);
    this.winstonLogger.silly('silly: ', dto);
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    const test = { name: 'cdragon', email: 'abcd@test.com', password: '1234' };
    const { title, context, name } = createArticleDto;
    this.printWinstonLog(test);
    this.winstonLogger.info('dsf', createArticleDto);
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
