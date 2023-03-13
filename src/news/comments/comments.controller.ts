import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post(':newsId')
  create(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const { text } = createCommentDto;
    const jWtUserId = req.user.userId;

    return this.commentsService.create(newsId, text, jWtUserId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const { text } = updateCommentDto;

    return this.commentsService.update(id, text);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
