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
      cover:
        'https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg',
    },
    {
      id: '2',
      title: 'title 2',
      description: 'text',
      author: 'Vadim',
      countView: 0,
      cover:
        'https://ichef.bbci.co.uk/news/640/cpsprodpb/14A82/production/_116301648_gettyimages-1071204136.jpg',
    },
  ];

  create(createNewsDto: CreateNewsDto): string {
    const news: News = {
      id: uuidv4(),
      ...createNewsDto,
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
      throw new HttpException('Новость не найдена.', 500);
    }

    return news;
  }

  update(id: string, updateNewsDto: UpdateNewsDto): string {
    const news = this.findOne(id);
    const indexOfNews = this.news.indexOf(news);
    const updatedNews = {
      ...news,
      ...updateNewsDto,
    };

    this.news[indexOfNews] = updatedNews;

    return `Новость отредактирована.`;
  }

  remove(id: string): string {
    const news = this.findOne(id);
    const indexOfNews = this.news.indexOf(news);

    this.news.splice(indexOfNews, 1);

    return `Новость удалена.`;
  }
}
