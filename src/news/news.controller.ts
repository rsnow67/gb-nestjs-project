import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news-dto';
import { News } from './news.interface';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  create(@Body() news: CreateNewsDto) {
    this.newsService.create(news);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.newsService.remove(id);
  }
}
