import { Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { CommentsService } from './comments.service';

export type Comment = { text: string; newsId: number };

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment) {
    const { newsId, text } = comment;
    const userId: number = client.data.user.id;
    const _comment = await this.commentsService.create(newsId, text, userId);

    this.server.to(newsId.toString()).emit('newComment', _comment);
  }

  @OnEvent('comment.update')
  handleUpdateCommentEvent(payload) {
    const { updatedComment } = payload;

    this.server
      .to(updatedComment.news.id.toString())
      .emit('updateComment', { updatedComment });
  }

  @OnEvent('comment.remove')
  handleRemoveCommentEvent(payload) {
    const { commentId, newsId } = payload;

    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    const { newsId } = client.handshake.query;
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
