import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private newsService: NewsService,
    private usersService: UsersService,
  ) {}

  async findAll(newsId: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: ['user', 'news'],
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
    createCommentDto: CreateCommentDto,
  ): Promise<CommentsEntity> {
    const { userId, text } = createCommentDto;
    const news = await this.newsService.findOne(newsId);
    const user = await this.usersService.findById(userId);
    const comment = {
      text,
      news,
      user,
    };

    return this.commentsRepository.save(comment);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    const comment = await this.findOne(id);
    const updatedComment = {
      ...comment,
      ...updateCommentDto,
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

    return 'Комментарий удален.';
  }
}
