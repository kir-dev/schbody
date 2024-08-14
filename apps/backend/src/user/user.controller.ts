import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    return this.userService.findMany(page, pageSize);
  }

  @Get(':id')
  async findOne(id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
