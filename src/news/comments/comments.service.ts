import { HttpException, Injectable } from '@nestjs/common';
import { Comment, Comments } from './comments.interface';
import { CreateCommentDto } from './dto/create-comment-dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment-dto';

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

  findAll(newsId: string): Comment[] | string {
    const comments = this.comments?.[newsId];

    if (!comments || !comments.length) {
      return 'Комментарии не найдены.';
    }

    return comments;
  }

  findOne(newsId: string, commentId: string): Comment {
    const comments = this.findAll(newsId);
    let comment = null;

    if (Array.isArray(comments) && comments.length > 0) {
      comment = comments.find((comment) => comment.id === commentId);
    }

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
      id: uuidv4(),
      ...createCommentDto,
    };

    this.comments[newsId].push(comment);

    return 'Комментарий создан.';
  }

  update(
    newsId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = this.findOne(newsId, commentId);
    const commentIndex = this.comments[newsId].indexOf(comment);
    const updateComment = {
      ...comment,
      ...updateCommentDto,
    };

    this.comments[newsId][commentIndex] = updateComment;

    return `Комментарий отредактирован.`;
  }

  removeAll(newsId: string): string {
    this.findAll(newsId);

    delete this.comments[newsId];

    return 'Комментарии удалены.';
  }

  remove(newsId: string, commentId: string) {
    const comment = this.findOne(newsId, commentId);
    const commentIndex = this.comments[newsId].indexOf(comment);

    this.comments[newsId].splice(commentIndex, 1);

    return 'Комментарий удален.';
  }
}
