import { Role } from 'src/auth/roles/roles.enum';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickName: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.avatar)
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: Role })
  @IsNotEmpty()
  @IsString()
  roles: Role;
}
