import { HttpException, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private usersService: UsersService,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<NewsEntity> {
    const { userId, ...newsData } = createNewsDto;
    const newNews = {
      ...newsData,
      user: await this.usersService.findById(parseInt(userId)),
    };

    return this.newsRepository.save(newNews);
  }

  findAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({
      relations: ['user', 'comments', 'comments.user'],
    });
  }

  findAllByAuthor(userId: number): Promise<NewsEntity[]> {
    return this.newsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user', 'comments', 'comments.user'],
    });
  }

  async findOne(id: number): Promise<NewsEntity> {
    const news = await this.newsRepository.findOne({
      where: {
        id,
      },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!news) {
      throw new HttpException('Новость не найдена.', 500);
    }

    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<NewsEntity> {
    const news = await this.findOne(id);
    const updatedNews = {
      ...news,
      ...updateNewsDto,
    };

    this.newsRepository.save(updatedNews);

    return updatedNews;
  }

  async remove(id: number): Promise<string> {
    const news = await this.findOne(id);
    this.newsRepository.remove(news);

    return 'Новость удалена.';
  }
}
