import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { renderNewsAll } from 'src/view/news/news-all';
import { renderDetailNews } from 'src/view/news/news-detail';
import { renderTemplate } from 'src/view/template';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { NewsService } from './news.service';
import { diskStorage } from 'multer';
import { HelperFileLoad } from 'src/utils/HelperFileLoad';

const PATH_NEWS = '/news-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_NEWS;

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

  @Get(':id/detail')
  getDetailView(@Param('id') id: string) {
    const news = this.newsService.findOne(id);
    let comments = this.commentsService.findAll(id);

    if (!Array.isArray(comments)) {
      comments = [];
    }

    const content = renderDetailNews(news, comments);

    return renderTemplate(content, {
      title: news.title,
      description: news.description,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
    }),
  )
  create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    const coverPath = cover?.filename ? PATH_NEWS + cover.filename : '';

    return this.newsService.create({
      ...news,
      cover: coverPath,
    });
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
