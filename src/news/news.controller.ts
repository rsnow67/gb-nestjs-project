import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { renderNewsAll } from 'src/view/news/news-all';
import { renderTemplate } from 'src/view/template';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('all')
  getAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    const news = this.newsService.findOne(id);
    const comments = this.commentsService.findAll(id);

    return {
      ...news,
      comments,
    };
  }

  @Get()
  getAllViews() {
    const news = this.newsService.findAll();
    const content = renderNewsAll(news);

    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости на свете',
    });
  }

  @Post()
  create(@Body() news: CreateNewsDto) {
    return this.newsService.create(news);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
