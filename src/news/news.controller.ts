import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { NewsService } from './news.service';
import { diskStorage } from 'multer';
import { HelperFileLoad } from 'src/utils/HelperFileLoad';
import imageFileFilter from 'src/utils/file-filters';
import { MailService } from 'src/mail/mail.service';
import { NewsEntity } from './news.entity';

const PATH_NEWS = '/news-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_NEWS;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminMails = ['vidman07@mail.ru', 'vidmanv07@gmail.com'];

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('all')
  async getAll() {
    return await this.newsService.findAll();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findOne(id);
    const comments = this.commentsService.findAll(id);

    return {
      ...news,
      comments,
    };
  }

  @Get()
  @Render('news-list')
  async getAllViews() {
    const news = await this.newsService.findAll();

    return { news, title: 'Список новостей' };
  }

  @Get(':id/detail')
  @Render('news-detail')
  async getView(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findOne(id);
    let comments = this.commentsService.findAll(id);

    if (!Array.isArray(comments)) {
      comments = [];
    }

    return { news, comments };
  }

  @Get('create/new')
  @Render('create-news')
  getCreateView() {
    return {};
  }

  @Get(':id/edit')
  @Render('edit-news')
  async getEditView(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findOne(id);

    return { news };
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newNews = await this.newsService.create({
      ...news,
      cover: coverPath,
    });

    // await this.mailService.sendNewNewsForAdmins(adminMails, newNews);

    return 'Новость создана.';
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    const data = { ...updateNewsDto };

    if (cover?.filename) data.cover = PATH_NEWS + cover.filename;

    const oldNews = await this.newsService.findOne(id);
    const updatedNews = await this.newsService.update(id, data);
    const dataForEmail: Partial<NewsEntity> = {};

    for (const key in updatedNews) {
      const newValue = updatedNews[key];
      const oldValue = oldNews[key];

      if (newValue !== oldValue) {
        dataForEmail[`new-${key}`] = newValue;
        dataForEmail[`old-${key}`] = oldValue;
      }
    }

    dataForEmail.id = updatedNews.id;

    // await this.mailService.sendUpdatedNewsForAdmins(
    //   adminMails,
    //   dataForEmail,
    //   oldNews.title,
    // );

    return `Новость отредактирована.`;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.remove(id);
  }
}
