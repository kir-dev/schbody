import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as mime from 'mime';
import { PrismaService } from 'nestjs-prisma';
import * as sharp from 'sharp';

import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAdmin(id: string, updateUserDto: UpdateUserAdminDto, currentUserRole: string) {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (!(updateUserDto.isSchResident ?? user.isSchResident) && updateUserDto.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }
    if ((updateUserDto.role === 'SUPERUSER' || user.role === 'SUPERUSER') && currentUserRole !== 'SUPERUSER') {
      throw new UnauthorizedException('Only superusers can manage superuser role');
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
    const hasPagination = page !== -1 && pageSize !== -1;
    return this.prisma.user.findMany({
      orderBy: { fullName: 'asc' },
      skip: hasPagination ? page * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      select: {
        authSchId: true,
        fullName: true,
        nickName: true,
        email: true,
        canHelpNoobs: true,
        role: true,
        createdAt: true,
        publicDesc: true,
      },
      where: {
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

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });
    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (!(updateData.isSchResident ?? user.isSchResident) && updateData.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }
    if (user.role === 'USER') {
      updateData.canHelpNoobs = false;
      updateData.publicDesc = '';
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

  async saveProfilePicture(authSchId: string, buffer: Buffer, mimetype: string) {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      throw new BadRequestException('Invalid image format');
    }
    try {
      await this.createOrUpdateProfilePicture(authSchId, buffer);
    } catch (error) {
      throw new NotFoundException(`User with id ${authSchId} not found`);
    }
  }

  async findProfilePicture(authSchId: string): Promise<Buffer> {
    try {
      const profilePic = await this.prisma.profilePicture.findUniqueOrThrow({ where: { userId: authSchId } });
      return profilePic.profileImage;
    } catch (error) {
      throw new NotFoundException(`User with id ${authSchId} not found`);
    }
  }

  private async createOrUpdateProfilePicture(userId: string, profileImage: Buffer) {
    const { image, mimeType } = await this.optimizeImage(profileImage);
    const data = { userId, profileImage: image, mimeType };
    try {
      await this.prisma.profilePicture.update({ where: { userId: userId }, data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          await this.prisma.profilePicture.create({ data });
          return;
        }
      }
      throw e;
    }
  }

  private async optimizeImage(source: Buffer): Promise<{ image: Buffer; mimeType: string }> {
    const image = sharp(source).jpeg({ mozjpeg: true }).resize(650, 900, { fit: 'cover' });
    const metadata = await image.metadata();
    const mimeType = mime.lookup(metadata.format, 'image/jpeg');
    return { mimeType, image: await image.toBuffer() };
  }
}
