import { HttpException, Injectable } from '@nestjs/common';
import { News } from './news.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';

@Injectable()
export class NewsService {
  private news: News[] = [
    {
      id: '1',
      title: 'title 1',
      description: 'text',
      author: 'Vadim',
      countView: 12,
    },
    {
      id: '2',
      title: 'title 2',
      description: 'text',
      author: 'Vadim',
      countView: 0,
    },
  ];

  create(createNewsDto: CreateNewsDto): string {
    const news: News = {
      ...createNewsDto,
      id: uuidv4(),
    };

    this.news.push(news);

    return 'Новость создана.';
  }

  findAll(): News[] {
    return this.news;
  }

  findOne(id: string): News {
    const news = this.news.find((news) => news.id === id);

    if (!news) {
      throw new HttpException('Новость с таким id не найдена.', 500);
    }

    return news;
  }

  private findNewsIndex(id: string) {
    const indexOfNews = this.news.findIndex((news) => news.id === id);

    if (indexOfNews < 0) {
      throw new HttpException('Новость с таким id не найдена.', 500);
    }

    return indexOfNews;
  }

  update(id: string, updateNewsDto: UpdateNewsDto) {
    console.log(id);
    const indexOfNews = this.findNewsIndex(id);
    const news = this.news[indexOfNews];
    const updatedNews = {
      ...news,
      ...updateNewsDto,
    };

    this.news[indexOfNews] = updatedNews;

    return 'Новость отредактирована.';
  }

  remove(id: string): string {
    const indexOfNews = this.findNewsIndex(id);
    this.news.splice(indexOfNews, 1);

    return 'Новость удалена.';
  }
}
