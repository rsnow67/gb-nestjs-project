import { Injectable, NotFoundException } from '@nestjs/common';
import { News } from './news.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewsDto } from './dto/create-news-dto';

@Injectable()
export class NewsService {
  private news: News[] = [
    {
      id: uuidv4(),
      title: 'title 1',
      description: 'text',
      author: 'Vadim',
      countView: 12,
    },
    {
      id: uuidv4(),
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

  findOne(id: string): News | NotFoundException {
    const news = this.news.find((news) => news.id === id);

    if (!news) {
      throw new NotFoundException();
    }

    return news;
  }

  remove(id: string): NotFoundException | string {
    const indexOfNews = this.news.findIndex((news) => news.id === id);

    if (indexOfNews < 0) {
      throw new NotFoundException();
    }

    this.news.splice(indexOfNews, 1);

    return 'Новость удалена.';
  }
}
