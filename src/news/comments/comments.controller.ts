import { CommentsEntity } from './comments.entity';
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
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const PATH_AVATAR = '/avatar-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_AVATAR;

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':newsId')
  @ApiOperation({ summary: 'Get all comments of news' })
  @ApiOkResponse({
    description: 'Return a list of all comments of news',
    type: CommentsEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async getAll(@Param('newsId', ParseIntPipe) newsId: number) {
    return this.commentsService.findAll(newsId);
  }

  @Get('comment/:id')
  @ApiOperation({ summary: 'Get one comment by id' })
  @ApiOkResponse({
    description: 'Return a news comment based on a particular id',
    type: CommentsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':newsId')
  @ApiOperation({ summary: 'Create new comment' })
  @ApiOkResponse({
    description: 'The comment has been successfully created.',
    type: CommentsEntity,
  })
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
  @ApiOperation({ summary: 'Edit comment by id' })
  @ApiOkResponse({
    description: 'The comment has been successfully updated.',
    type: CommentsEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const { text } = updateCommentDto;

    return this.commentsService.update(id, text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiOkResponse({
    description: 'The comment has been successfully deleted.',
    type: 'string',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.commentsService.remove(id, req.user.userId);
  }
}
