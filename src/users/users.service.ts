import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/roles.enum';
import { hash } from 'src/utils/crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import UpdateUserDto from './dto/update-user-dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('Пользователь не найден.', 500);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException('Пользователь не найден.', 500);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<UsersEntity>> {
    const passwordHash = await hash(createUserDto.password);

    const user = {
      ...createUserDto,
      password: passwordHash,
    };

    this.usersRepository.save(user);

    const { password, ...result } = user;

    return result;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<UsersEntity>> {
    const user = await this.findById(id);
    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await hash(data.password);
    }

    if (data.roles && data.roles !== Role.Admin) {
      delete data.roles;
    }

    const updatedUser = {
      ...user,
      ...data,
    };

    this.usersRepository.save(updatedUser);

    const { password, ...result } = updatedUser;

    return result;
  }

  async remove(id: number): Promise<string> {
    const user = await this.findById(id);

    this.usersRepository.remove(user);

    return `Пользователь ${user.nickName} удален.`;
  }
}
