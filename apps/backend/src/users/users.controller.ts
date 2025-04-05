import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user-dto';
import jwt from 'jsonwebtoken';
import { credentials } from 'src/config/credentials';
import { JwtAuthGuard } from './user.guard';
@Controller('v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: createUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: loginUserDto) {
    return this.usersService.login(createUserDto);
  }

  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('username-exists')
  async checkUsernameExists(@Body('username') username: string) {
    return await this.usersService.userNameAvailable(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Req() req: any) {
    return await this.usersService.findOne(req.user.id);
  }
}
