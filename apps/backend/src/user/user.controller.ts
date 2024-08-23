import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

import { Roles } from '../auth/decorators/Roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('pageSize', ParseIntPipe) pageSize: number = 10) {
    return this.userService.findMany(page, pageSize);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BODY_ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
