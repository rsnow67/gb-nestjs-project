import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'src/utils/crypto';
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

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const passwordHash = await hash(createUserDto.password);

    const user = {
      ...createUserDto,
      password: passwordHash,
    };

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<string> {
    const user = await this.findById(id);

    this.usersRepository.remove(user);

    return `Пользователь ${user.nickName} удален.`;
  }
}
