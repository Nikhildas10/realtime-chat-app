import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from 'src/utils/prismaConfig.,';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { credentials } from 'src/config/credentials';

@Injectable()
export class UsersService {
  async create(createUserDto: Prisma.UserCreateInput) {
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

  findAll() {
    return prisma.user.findMany();
  }

  findOne(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
