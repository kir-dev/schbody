import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Injectable()
export class UserService {
  async updateAdmin(id: string, updateUserDto: UpdateUserAdminDto) {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (user.isSchResident === false && updateUserDto.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }

    return this.prisma.user.update({ where: { authSchId: id }, data: updateUserDto });
  }
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: { authSchId: id },
    });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findMany(page: number, pageSize: number): Promise<{ users: User[]; pageNumber: number; totalUsers: number }> {
    const [totalUsers, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        orderBy: { fullName: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      users,
      pageNumber: page,
      totalUsers,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });
    const updateData = updateUserDto;
    if (user.role === 'USER') {
      updateData.canHelpNoobs = false;
      updateData.publicDesc = '';
    }
    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (user.isSchResident === false && updateUserDto.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }

    return this.prisma.user.update({ where: { authSchId: id }, data: updateData });
  }

  // TODO maybe remove it? currently not used (could be useful later)
  async delete(id: string): Promise<User> {
    try {
      return this.prisma.user.delete({ where: { authSchId: id } });
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
