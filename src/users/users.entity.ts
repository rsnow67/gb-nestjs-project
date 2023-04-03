import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Role } from 'src/auth/roles/roles.enum';
import { CommentsEntity } from 'src/news/comments/comments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  nickName: string;

  @Column('text')
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column('text')
  password: string;

  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @Column('text', { nullable: true })
  avatar?: string;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
