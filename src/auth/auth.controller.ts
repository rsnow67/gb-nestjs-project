import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class AuthLogin {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description: 'Successful authentication.',
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password.' })
  @ApiBody({
    description: 'User credentials',
    type: AuthLogin,
  })
  async login(
    @Request() req,
    @Res({ passthrough: true }) res,
  ): Promise<string> {
    const { access_token, userId } = await this.authService.login(req.user);

    res.cookie('jwt', access_token, { httpOnly: true });
    res.cookie('userId', userId);

    return access_token;
  }

  @Get('login')
  @ApiOperation({ summary: 'Get login view' })
  @ApiOkResponse({
    description: 'Render login view.',
  })
  @Render('auth/login')
  async render() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
