import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { prisma } from 'src/utils/prismaConfig.,';

@Injectable()
export class MessagesService {
  create(createMessageDto: CreateMessageDto, senderId: string) {
    return prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: createMessageDto.receiverId,
        text: createMessageDto.text,
      },
    });
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
            status: 'SENT',
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
    await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: userId,
        status: 'SENT',
      },
      data: {
        status: 'READ',
      },
    });
    return { message: 'Messages marked as delivered' };
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
