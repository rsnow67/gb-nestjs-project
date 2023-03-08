import { AuthModule } from './../../auth/auth.module';
import { SocketCommentsGateway } from './sockets-comments.gateway';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, SocketCommentsGateway],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
  ],
})
export class CommentsModule {}
