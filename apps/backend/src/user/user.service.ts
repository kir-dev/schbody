import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<UserDto> {
    return this.prisma.user.findUnique({
      where: { authSchId: id },
    });
  }

  async findMany(page: number, pageSize: number): Promise<UserDto[]> {
    return this.prisma.user.findMany({ orderBy: { fullName: 'asc' }, skip: (page - 1) * pageSize, take: pageSize });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.prisma.user.update({ where: { authSchId: id }, data: updateUserDto });
  }

  async delete(id: string): Promise<UserDto> {
    return this.prisma.user.delete({ where: { authSchId: id } });
  }
}
