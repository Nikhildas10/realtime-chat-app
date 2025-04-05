import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from 'src/utils/prismaConfig.,';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { credentials } from 'src/config/credentials';
import { uploadImage } from 'src/utils/imageUpload';

@Injectable()
export class UsersService {
  async create(createUserDto: Prisma.UserCreateInput) {
    if (createUserDto.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }
    }
    if (createUserDto.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await prisma.user.create({
      data: createUserDto,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(createUserDto: Prisma.UserCreateInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      credentials.accessTokenSecret!,
    );

    const { password, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Username already exists');
      }
    }
    if (updateUserDto.avatar?.includes('data:image/')) {
      updateUserDto.avatar = await uploadImage(updateUserDto.avatar, 'avatar');
    }
    return prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async userNameAvailable(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    
    if (user) {
      throw new BadRequestException('username already exists');
    } else {
      return { message: 'username is available' };
    }
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select:{
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
