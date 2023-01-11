import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import imageFileFilter from 'src/utils/file-filters';
import { HelperFileLoad } from 'src/utils/HelperFileLoad';
import { Comment } from './comments.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

const PATH_AVATAR = '/avatar-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_AVATAR;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':newsId')
  getAll(@Param('newsId', ParseIntPipe) newsId: number): Comment[] {
    return this.commentsService.findAll(newsId);
  }

  @Get(':newsId/:commentId')
  get(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Comment {
    return this.commentsService.findOne(newsId, commentId);
  }

  @Post(':newsId/:commentId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post(':newsId/')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createComment(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): string {
    const avatarPath = avatar?.filename ? PATH_AVATAR + avatar.filename : '';

    return this.commentsService.create(newsId, {
      ...createCommentDto,
      avatar: avatarPath,
    });
  }

  @Post(':newsId/:commentId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createReply(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): string {
    const avatarPath = avatar?.filename ? PATH_AVATAR + avatar.filename : '';

    return this.commentsService.createReply(newsId, commentId, {
      ...createCommentDto,
      avatar: avatarPath,
    });
  }

  @Patch(':newsId/:commentId')
  update(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): string {
    return this.commentsService.update(newsId, commentId, updateCommentDto);
  }

  @Delete(':newsId')
  removeAll(@Param('newsId', ParseIntPipe) newsId: number): string {
    return this.commentsService.removeAll(newsId);
  }

  @Delete(':newsId/:commentId')
  remove(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): string {
    return this.commentsService.remove(newsId, commentId);
  }
}
