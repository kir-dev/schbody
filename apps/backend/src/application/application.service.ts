import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Application, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ApplicationPeriodService } from 'src/application-period/application-period.service';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicationPeriodService: ApplicationPeriodService
  ) {}

  async create(createApplicationDto: CreateApplicationDto, user: User) {
    try {
      return await this.prisma.application.create({
        data: {
          user: {
            connect: {
              authSchId: user.authSchId,
            },
          },
          applicationPeriod: {
            connect: {
              id: createApplicationDto.applicationPeriodId,
            },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException('Nem sikerült létrehozni');
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findAll() {
    return await this.prisma.application.findMany();
  }

  async findOne(id: number): Promise<Application> {
    const application = this.prisma.application.findFirst({
      where: {
        id,
      },
    });
    if (!application) {
      throw new NotFoundException('A keresett jelentkezés nem található');
    }
    return application;
  }

  async getCurrentUserApplication(user: User): Promise<Application | null> {
    const currentPeriod = await this.applicationPeriodService.getCurrentPeriod();
    try {
      return await this.prisma.application.findFirstOrThrow({
        where: {
          AND: [
            {
              applicationPeriodId: currentPeriod.id,
            },
            {
              userId: user.authSchId,
            },
          ],
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Nem található jelentkezés');
        }
      }
    }
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    try {
      return await this.prisma.application.update({
        where: {
          id,
        },
        data: {
          status: updateApplicationDto.applicationStatus,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('A keresett jelentkezés nem található');
        }
      }
    }
  }

  async remove(id: number, user: User): Promise<Application> {
    const application = await this.prisma.application.findFirst({
      where: {
        id,
      },
    });
    if (!application) {
      throw new NotFoundException('A keresett jelentkezés nem található');
    }
    if (application.userId === user.authSchId || user.role === Role.BODY_ADMIN || user.role === Role.BODY_MEMBER) {
      return await this.prisma.application.delete({
        where: {
          id,
        },
      });
    }
    throw new ForbiddenException('Nem törölheted mások jelentkezését');
  }
}
