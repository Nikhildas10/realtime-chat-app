import { forwardRef, Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string[]>(); 
  constructor(
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {

    this.userSocketMap.forEach((socketIds, userId) => {
      const updatedSocketIds = socketIds.filter((id) => id !== client.id);

      if (updatedSocketIds.length === 0) {
        this.userSocketMap.delete(userId);
      } else {
        this.userSocketMap.set(userId, updatedSocketIds);
      }
    });

    this.broadcastOnlineUsers();
  }

  @SubscribeMessage('identity')
  async handleIdentity(client: Socket, userId: string) {
    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, []);
    }

    const socketList = this.userSocketMap.get(userId)!;
    if (!socketList.includes(client.id)) {
      socketList.push(client.id);
    }

    this.broadcastOnlineUsers();
    await this.messagesService.markUndeliveredMessagesAsDelivered(userId);
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    payload: { from: string; to: string; isTyping: boolean },
  ) {
    const recipientSocketIds = this.userSocketMap.get(payload.to) || [];
    recipientSocketIds.forEach((socketId) => {
      this.server.to(socketId).emit('typing', {
        from: payload.from,
        isTyping: payload.isTyping,
      });
    });
  }

  @SubscribeMessage('send_message')
  handleSendMessage(client: Socket, payload: { to: string }) {
    const recipientSocketIds = this.userSocketMap.get(payload.to) || [];
    if (recipientSocketIds.length > 0) {
      recipientSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('receive_message');
      });

      let senderId: string | null = null;
      this.userSocketMap.forEach((sockets, userId) => {
        if (sockets.includes(client.id)) {
          senderId = userId;
        }
      });

      if (senderId) {
        this.server.to(client.id).emit('message_status_updated', {
          partnerId: payload.to,
          status: 'DELIVERED',
        });
      }
    }
  }

  private broadcastOnlineUsers() {
    const onlineUsers = Array.from(this.userSocketMap.keys());
    this.server.emit('online_users', onlineUsers);
  }

  isUserOnline(userId: string): boolean {
    return (
      this.userSocketMap.has(userId) &&
      this.userSocketMap.get(userId)!.length > 0
    );
  }

  notifyMessageStatus() {
    this.server.emit('message_status_updated');
  }

  getSocketIds(userId: string): string[] {
    return this.userSocketMap.get(userId) || [];
  }
}
