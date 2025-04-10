import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { prisma } from 'src/utils/prismaConfig.,';
import { WebsocketGateway } from 'src/utils/websocketGateway';

@Injectable()
export class MessagesService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  async create(createMessageDto: CreateMessageDto, senderId: string) {

    const initialStatus = this.websocketGateway.isUserOnline(
      createMessageDto.receiverId,
    )
      ? 'DELIVERED'
      : 'SENT';

    const message = await prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: createMessageDto.receiverId,
        text: createMessageDto.text,
        status: initialStatus,
      },
    });

    if (initialStatus === 'DELIVERED') {
      const senderSockets = this.websocketGateway.getSocketIds(senderId);
      senderSockets.forEach((socketId) => {
        this.websocketGateway.server
          .to(socketId)
          .emit('message_status_updated', {
            partnerId: createMessageDto.receiverId,
            status: 'DELIVERED',
          });
      });
    }

    return message;
  }

  async findAll(userId: string) {
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const chatPartnersMap = new Map<string, any>();

    for (const message of conversations) {
      const partnerId =
        message.senderId === userId ? message.receiverId : message.senderId;
      const partner =
        message.senderId === userId ? message.receiver : message.sender;

      if (!chatPartnersMap.has(partnerId)) {
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: userId,
            status: {
              not: 'READ',
            },
          },
        });

        chatPartnersMap.set(partnerId, {
          id: partnerId,
          username: partner.username,
          avatar: partner.avatar,
          lastMessage: message.text,
          time: message.createdAt,
          unread: unreadCount,
        });
      }
    }

    const formattedConversations = Array.from(chatPartnersMap.values()).sort(
      (a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      },
    );
    return formattedConversations;
  }

  async findOne(senderId: string, receiverId: string) {
    const [messages, receiver] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          text: true,
          senderId: true,
          receiverId: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      }),
    ]);

    return {
      messages,
      recipient: receiver,
    };
  }

  async update(userId: string, senderId: string) {
    const updatedMessages = await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: userId,
        status: { in: ['SENT', 'DELIVERED'] },
      },
      data: {
        status: 'READ',
      },
    });

    if (updatedMessages.count > 0) {
      const senderSockets = this.websocketGateway.getSocketIds(senderId);
      senderSockets.forEach((socketId) => {
        this.websocketGateway.server
          .to(socketId)
          .emit('message_status_updated', {
            partnerId: userId,
            status: 'READ',
          });
      });
    }

    return { count: updatedMessages.count };
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async markUndeliveredMessagesAsDelivered(userId: string) {
    const undeliveredMessages = await prisma.message.findMany({
      where: {
        receiverId: userId,
        status: 'SENT',
      },
    });

    for (const message of undeliveredMessages) {
      await prisma.message.update({
        where: { id: message.id },
        data: { status: 'DELIVERED' },
      });

      const senderSocketIds = this.websocketGateway.getSocketIds(
        message.senderId,
      );
      senderSocketIds.forEach((socketId) => {
        this.websocketGateway.server
          .to(socketId)
          .emit('message_status_updated', {
            partnerId: userId,
            status: 'DELIVERED',
          });
      });
    }

    return { count: undeliveredMessages.length };
  }
}
