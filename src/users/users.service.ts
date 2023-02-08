import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
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

  async findOne(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('Пользователь не найден.', 500);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    return this.usersRepository.save(createUserDto);
  }

  async remove(id: number): Promise<string> {
    const user = await this.findOne(id);

    this.usersRepository.remove(user);

    return `Пользователь ${user.nickName} удален.`;
  }
}
