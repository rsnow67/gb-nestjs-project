import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { renderDetailNews } from 'src/view/news/news-detail';
import { renderTemplate } from 'src/view/template';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { NewsService } from './news.service';
import { diskStorage } from 'multer';
import { HelperFileLoad } from 'src/utils/HelperFileLoad';
import imageFileFilter from 'src/utils/file-filters';
import { MailService } from 'src/mail/mail.service';

const PATH_NEWS = '/news-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_NEWS;
const adminMails = ['vidman07@mail.ru', 'vidmanv07@gmail.com'];

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
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
  @Render('news-list')
  getAllViews() {
    const news = this.newsService.findAll();

    return { news, title: 'Список новостей' };
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

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    const coverPath = cover?.filename ? PATH_NEWS + cover.filename : '';

    const newNews = this.newsService.create({
      ...news,
      cover: coverPath,
    });

    await this.mailService.sendNewNewsForAdmins(adminMails, newNews);

    return 'Новость создана.';
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
