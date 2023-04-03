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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { access_token, userId } = await this.authService.login(req.user);

    res.cookie('jwt', access_token, { httpOnly: true });
    res.cookie('userId', userId);

    return access_token;
  }

  @Get('login')
  @Render('auth/login')
  async render() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
