import { Role } from 'src/auth/roles/roles.enum';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  roles: Role;
}
