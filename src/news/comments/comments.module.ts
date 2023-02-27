import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => NewsModule),
    UsersModule,
  ],
})
export class CommentsModule {}
