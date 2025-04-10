import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { WebsocketGateway } from 'src/utils/websocketGateway';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService,WebsocketGateway],
})
export class MessagesModule {}
