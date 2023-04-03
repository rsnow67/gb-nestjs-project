import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { AuthService } from '../auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const {
      cookies: { jwt },
    } = context.switchToHttp().getRequest();

    const user = await this.authService.verify(jwt);
    const _user = await this.usersService.findById(user.id);

    return requiredRoles.some((role) => _user?.roles === role);
  }
}
