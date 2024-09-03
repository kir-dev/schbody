import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAdmin(id: string, updateUserDto: UpdateUserAdminDto) {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (user.isSchResident === false && updateUserDto.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }

    return this.prisma.user.update({ where: { authSchId: id }, data: updateUserDto });
  }
  async searchUser(query: string): Promise<{ users: User[]; pageNumber: number; totalUsers: number }> {
    if (query.length < 3) {
      throw new BadRequestException('Query must be at least 3 characters long');
    }
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { nickName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return {
      users,
      pageNumber: -1,
      totalUsers: users.length,
    };
  }
  async findOne(id: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: { authSchId: id },
    });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
  findMembers(page: number, pageSize: number) {
    return this.prisma.user.findMany({
      orderBy: { fullName: 'asc' },
      skip: page * pageSize,
      take: pageSize,
      where: {
        canHelpNoobs: true,
        OR: [{ role: 'BODY_MEMBER' }, { role: 'BODY_ADMIN' }],
      },
    });
  }

  async findMany(page: number, pageSize: number): Promise<{ users: User[]; pageNumber: number; totalUsers: number }> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const [totalUsers, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        orderBy: { fullName: 'asc' },
        skip: hasPagination ? page * pageSize : undefined,
        take: hasPagination ? pageSize : undefined,
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
