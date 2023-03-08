import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private newsService: NewsService,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(newsId: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: ['user', 'news'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<CommentsEntity> {
    const comment = await this.commentsRepository.findOne({
      where: {
        id,
      },
      relations: ['user', 'news'],
    });

    if (!comment) {
      throw new HttpException('Комментарий не найден.', 500);
    }

    return comment;
  }

  async create(
    newsId: number,
    message: string,
    userId: number,
  ): Promise<CommentsEntity> {
    const news = await this.newsService.findOne(newsId);
    const user = await this.usersService.findById(userId);
    const comment = {
      text: message,
      news,
      user,
    };

    return this.commentsRepository.save(comment);
  }

  async update(id: number, message: string): Promise<CommentsEntity> {
    const comment = await this.findOne(id);
    const updatedComment = {
      ...comment,
      message,
    };

    this.commentsRepository.save(updatedComment);

    return updatedComment;
  }

  async removeAll(newsId: number): Promise<string> {
    const comments = await this.findAll(newsId);

    this.commentsRepository.remove(comments);

    return 'Комментарии удалены.';
  }

  async remove(id: number): Promise<string> {
    const comment = await this.findOne(id);

    this.commentsRepository.remove(comment);

    this.eventEmitter.emit('comment.remove', {
      commentId: id,
      newsId: comment.news.id,
    });

    return 'Комментарий удален.';
  }
}
