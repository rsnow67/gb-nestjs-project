import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar: string;
}
