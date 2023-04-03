import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  checkPermission,
  Modules,
} from 'src/auth/roles/utils/check-permission';

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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The comment is not found.',
        },
        HttpStatus.NOT_FOUND,
      );
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

  async update(id: number, text: string): Promise<CommentsEntity> {
    const comment = await this.findOne(id);
    const updatedComment = {
      ...comment,
      text,
    };

    this.commentsRepository.save(updatedComment);

    this.eventEmitter.emit('comment.update', { updatedComment });

    return updatedComment;
  }

  async removeAll(newsId: number): Promise<string> {
    const comments = await this.findAll(newsId);

    this.commentsRepository.remove(comments);

    return 'The comments have been removed.';
  }

  async remove(id: number, userId: number): Promise<string> {
    const comment = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    if (
      user.id !== comment.user.id &&
      !checkPermission(Modules.removeComment, user.roles)
    ) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You do not have sufficient rights to delete.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    this.commentsRepository.remove(comment);

    this.eventEmitter.emit('comment.remove', {
      commentId: id,
      newsId: comment.news.id,
    });

    return 'The comments has been removed.';
  }
}
