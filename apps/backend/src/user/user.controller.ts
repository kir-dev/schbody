import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Roles } from '../auth/decorators/Roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findAll(@Query('page', ParseIntPipe) page?: number, @Query('pageSize', ParseIntPipe) pageSize?: number) {
    return this.userService.findMany(page, pageSize);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.findOne(user.authSchId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async updateCurrentUser(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.update(user.authSchId, updateUserDto);
  }
  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async searchUser(@Query('query') query: string) {
    return this.userService.searchUser(query);
  }
  @Get('members')
  async getMembers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10
  ) {
    return this.userService.findMembers(page, pageSize);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserAdminDto, @CurrentUser() user: User) {
    return this.userService.updateAdmin(id, updateUserDto, user.role);
  }
}
