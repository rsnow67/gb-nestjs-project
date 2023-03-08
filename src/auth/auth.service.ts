import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { compare } from 'src/utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UsersEntity> | null> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordCorrect = await compare(password, user.password);

    if (user && isPasswordCorrect) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Partial<UsersEntity>): Promise<any> {
    const payload = { id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}
