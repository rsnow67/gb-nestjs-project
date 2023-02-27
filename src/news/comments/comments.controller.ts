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
  async getAll(@Param('newsId', ParseIntPipe) newsId: number) {
    return this.commentsService.findAll(newsId);
  }

  @Get(':newsId/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Post(':newsId')
  createComment(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(newsId, createCommentDto);
  }

  // @Post(':newsId/:commentId')
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     storage: diskStorage({
  //       destination: helperFileLoad.destinationPath.bind(helperFileLoad),
  //       filename: helperFileLoad.customFileName.bind(helperFileLoad),
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // createReply(
  //   @Param('newsId', ParseIntPipe) newsId: number,
  //   @Param('commentId', ParseIntPipe) commentId: number,
  //   @Body() createCommentDto: CreateCommentDto,
  //   @UploadedFile() avatar: Express.Multer.File,
  // ): string {
  //   const avatarPath = avatar?.filename ? PATH_AVATAR + avatar.filename : '';

  //   return this.commentsService.createReply(newsId, commentId, {
  //     ...createCommentDto,
  //     avatar: avatarPath,
  //   });
  // }

  @Patch(':newsId/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':newsId')
  removeAll(@Param('newsId', ParseIntPipe) newsId: number) {
    return this.commentsService.removeAll(newsId);
  }

  @Delete(':newsId/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
