import { HttpException, Injectable } from '@nestjs/common';
import { Comment, Comments } from './comments.interface';
import { CreateCommentDto } from './dto/create-comment-dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  private readonly comments: Comments = {
    1: [
      {
        id: '1',
        author: 'Alex',
        text: 'Первый комментарий',
      },
      {
        id: '2',
        author: 'Alex',
        text: 'Второй комментарий',
      },
    ],
  };

  findAll(newsId: string): Comment[] {
    const comments = this.comments?.[newsId];

    if (!comments || !comments.length) {
      throw new HttpException('Комментарии не найдены.', 500);
    }

    return comments;
  }

  findOne(newsId: string, commentId: string): Comment {
    const comments = this.findAll(newsId);
    const comment = comments.length
      ? comments.find((comment) => comment.id === commentId)
      : null;

    if (!comment) {
      throw new HttpException('Комментарий не найден.', 500);
    }

    return comment;
  }

  create(newsId: string, createCommentDto: CreateCommentDto): string {
    const comments = this.comments?.[newsId];

    if (!comments) {
      this.comments[newsId] = [];
    }

    const comment = {
      ...createCommentDto,
      id: uuidv4(),
    };

    this.comments[newsId].push(comment);

    return 'Комментарий создан.';
  }

  removeAll(newsId: string): string {
    this.findAll(newsId);

    delete this.comments[newsId];

    return 'Комментарии удалены.';
  }

  remove(newsId: string, commentId: string) {
    const comments = this.findAll(newsId);
    const commentIndex = comments.findIndex(
      (comment) => comment.id === commentId,
    );

    comments.splice(commentIndex, 1);

    return 'Комментарий удален.';
  }
}
