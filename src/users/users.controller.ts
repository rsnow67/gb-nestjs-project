import { UsersEntity } from './users.entity';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from 'src/utils/HelperFileLoad';
import { CreateUserDto } from './dto/create-user-dto';
import UpdateUserDto from './dto/update-user-dto';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const PATH_AVATAR = '/avatar-static/';
const helperFileLoad = new HelperFileLoad();
helperFileLoad.path = PATH_AVATAR;

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Return a list of all users',
    type: UsersEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async getAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the user by id' })
  @ApiOkResponse({
    description: 'Return a user based on a particular id',
    type: UsersEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UsersEntity,
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const avatarPath = avatar?.filename ? PATH_AVATAR + avatar.filename : '';
    const newUser = await this.usersService.create({
      ...createUserDto,
      avatar: avatarPath,
    });

    return `Пользователь с именем ${newUser.nickName} создан.`;
  }

  @Get(':id/edit')
  @ApiOperation({ summary: 'Get edit-user view' })
  @ApiOkResponse({
    description: 'Render view of editing user.',
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @Render('edit-user')
  async getEditView(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoad.destinationPath.bind(helperFileLoad),
        filename: helperFileLoad.customFileName.bind(helperFileLoad),
      }),
    }),
  )
  @Patch()
  @ApiOperation({ summary: 'Edit user by id' })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: UsersEntity,
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req,
  ) {
    const id = req.user.userId;
    const avatarPath = avatar?.filename ? PATH_AVATAR + avatar?.filename : '';
    const data = avatarPath
      ? { ...updateUserDto, avatar: avatarPath }
      : { ...updateUserDto };

    return await this.usersService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: 'string',
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
