import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Comment } from './comments.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':newsId')
  getAll(@Param('newsId') newsId: string): Comment[] {
    return this.commentsService.findAll(newsId);
  }

  @Get(':newsId/:commentId')
  get(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
  ): Comment {
    return this.commentsService.findOne(newsId, commentId);
  }

  @Post(':newsId/:commentId')
  create(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): string {
    if (typeof commentId === 'string' && commentId !== ':commentId') {
      return this.commentsService.createReply(
        newsId,
        commentId,
        createCommentDto,
      );
    }

    return this.commentsService.create(newsId, createCommentDto);
  }

  @Patch(':newsId/:commentId')
  update(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): string {
    return this.commentsService.update(newsId, commentId, updateCommentDto);
  }

  @Delete(':newsId')
  removeAll(@Param('newsId') newsId: string): string {
    return this.commentsService.removeAll(newsId);
  }

  @Delete(':newsId/:commentId')
  remove(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
  ): string {
    return this.commentsService.remove(newsId, commentId);
  }
}
