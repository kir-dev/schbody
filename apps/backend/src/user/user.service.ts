import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, ProfilePictureStatus, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { optimizeImage } from 'src/util';

import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApplicationService } from '../application/application.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicationService: ApplicationService,
    private emailService: EmailService
  ) {}

  async findPendingProfilePictures() {
    try {
      return this.prisma.profilePicture.findMany({
        where: {
          status: ProfilePictureStatus.PENDING,
        },
        take: 10,
        select: {
          user: true,
          mimeType: true,
          status: true,
        },
      });
    } catch (_e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateAdmin(id: string, updateUserDto: UpdateUserAdminDto, currentUserRole: string) {
    const user = await this.prisma.user.findUnique({ where: { authSchId: id } });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (!(updateUserDto.isSchResident ?? user.isSchResident) && updateUserDto.roomNumber) {
      throw new BadRequestException('Non-resident users cannot have a room number');
    }
    if (
      (updateUserDto.role === 'SUPERUSER' || (user.role === 'SUPERUSER' && updateUserDto.role)) &&
      currentUserRole !== 'SUPERUSER'
    ) {
      throw new UnauthorizedException('Only superusers can manage superuser role');
    }

    return this.prisma.user.update({ where: { authSchId: id }, data: updateUserDto });
  }

  async setProfilePictureStatus(id: string, status: any) {
    try {
      const transactionResult = await this.prisma.$transaction(async (tx) => {
        if (status !== ProfilePictureStatus.PENDING) {
          await this.applicationService.setActiveApplicationsStatus(id, status, tx);
        }
        return tx.profilePicture.update({
          where: { userId: id },
          data: { status: status },
        });
      });
      const user = await this.prisma.user.findUnique({ where: { authSchId: id } });
      await this.emailService.sendEmail(
        user.email,
        '[SCHBody] A profilképed állapota módosult',
        'Amennyiben volt aktív, elbírálás alatt álló jelentkezésed, annak státusza megváltozott. Kérjük, hogy ellenőrizd a jelentkezésed státuszát a SCHBody felületén.'
      );
      return transactionResult;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User not found`);
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
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
    if (updateData.isSchResident === false) {
      updateData.roomNumber = null;
    }

    return this.prisma.user.update({ where: { authSchId: id }, data: updateData });
  }

  // TODO maybe remove it? currently not used (could be useful later)
  async delete(id: string): Promise<User> {
    try {
      return this.prisma.user.delete({ where: { authSchId: id } });
    } catch (_error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async saveProfilePicture(authSchId: string, buffer: Buffer, mimetype: string) {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      throw new BadRequestException('Invalid image format');
    }
    try {
      return this.createOrUpdateProfilePicture(authSchId, buffer);
    } catch (_error) {
      throw new NotFoundException(`User with id ${authSchId} not found`);
    }
  }

  async deleteProfilePicture(authSchId: string) {
    try {
      const transactionResult = await this.prisma.$transaction(async (tx) => {
        await this.applicationService.setActiveApplicationsStatus(authSchId, 'REJECTED', tx);
        return tx.profilePicture.delete({
          where: { userId: authSchId },
        });
      });
      const user = await this.prisma.user.findUnique({ where: { authSchId } });
      await this.emailService.sendEmail(
        user.email,
        '[SCHBody] A profilképed törlésre került',
        'A profilképed törlésre került, amennyiben van aktív, elbírálás alatt álló jelentkezésed, most elutasítottá vált. Ahhoz, hogy jelentkezésed újra elfogadható legyen, tölts fel egy új profilképet.'
      );
      return transactionResult;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`User with id ${authSchId} not found`);
        }
      }
      throw e;
    }
  }

  async findProfilePicture(authSchId: string): Promise<Buffer> {
    try {
      const profilePic = await this.prisma.profilePicture.findUniqueOrThrow({ where: { userId: authSchId } });

      const imageBuffer = Buffer.from(profilePic.profileImage.buffer);
      return imageBuffer;
    } catch (_error) {
      throw new NotFoundException(`User with id ${authSchId} not found`);
    }
  }

  private async createOrUpdateProfilePicture(userId: string, profileImage: Buffer) {
    const { image, mimeType } = await optimizeImage(profileImage, true);
    const data = { userId, profileImage: image, mimeType };
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.applicationService.setActiveApplicationsStatus(userId, 'SUBMITTED', tx);
        return tx.profilePicture.update({
          where: { userId: userId },
          data: {
            ...data,
            status: ProfilePictureStatus.PENDING,
          },
        });
      });
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
}
