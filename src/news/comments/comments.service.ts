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
        id: 1,
        author: 'Alex',
        text: 'Первый комментарий',
      },
      {
        id: 2,
        author: 'Alex',
        text: 'Второй комментарий',
      },
    ],
  };

  findAll(newsId: number): Comment[] {
    const comments = this.comments?.[newsId];

    if (!comments || !comments.length) {
      return [];
    }

    return comments;
  }

  findOne(newsId: number, commentId: number): Comment {
    const comments = this.findAll(newsId);
    let comment = null;

    if (comments.length > 0) {
      comment = comments.find((comment) => comment.id === commentId);
    }

    if (!comment) {
      throw new HttpException('Комментарий не найден.', 500);
    }

    return comment;
  }

  create(newsId: number, createCommentDto: CreateCommentDto): string {
    const comments = this.comments?.[newsId];

    if (!comments) {
      this.comments[newsId] = [];
    }

    const comment = {
      id: Date.now(),
      ...createCommentDto,
    };

    this.comments[newsId].push(comment);

    return 'Комментарий создан.';
  }

  createReply(
    newsId: number,
    commentId: number,
    createCommentDto: CreateCommentDto,
  ): string {
    const comment = this.findOne(newsId, commentId);

    if (!comment.replies) {
      comment.replies = [];
    }

    const reply = {
      id: uuidv4(),
      ...createCommentDto,
    };

    comment.replies.push(reply);

    return 'Ответ на комментарий создан.';
  }

  update(
    newsId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): string {
    const comment = this.findOne(newsId, commentId);
    const commentIndex = this.comments[newsId].indexOf(comment);
    const updateComment = {
      ...comment,
      ...updateCommentDto,
    };

    this.comments[newsId][commentIndex] = updateComment;

    return `Комментарий отредактирован.`;
  }

  removeAll(newsId: number): string {
    this.findAll(newsId);

    delete this.comments[newsId];

    return 'Комментарии удалены.';
  }

  remove(newsId: number, commentId: number): string {
    const comment = this.findOne(newsId, commentId);
    const commentIndex = this.comments[newsId].indexOf(comment);

    this.comments[newsId].splice(commentIndex, 1);

    return 'Комментарий удален.';
  }
}
