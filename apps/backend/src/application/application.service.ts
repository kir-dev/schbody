import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Application, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ApplicationPeriodService } from 'src/application-period/application-period.service';
import { PaginationDto } from 'src/dto/pagination.dto';

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
      const applicationPeriod = await this.prisma.applicationPeriod.findFirstOrThrow({
        where: {
          id: createApplicationDto.applicationPeriodId,
        },
      });
      if (new Date(applicationPeriod.applicationPeriodEndAt) < new Date()) {
        throw new BadRequestException('A jelentkezési időszak lejárt');
      }
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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Ez a jelentkezés már létezik');
        } else if (e.code === 'P2025') {
          throw new NotFoundException('Nem található időszak');
        }
      }
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException('Nem sikerült létrehozni');
    }
  }

  async findAll(page: number, pageSize: number): Promise<PaginationDto<Application>> {
    const skip = page * pageSize;
    const applications = this.prisma.application.findMany({
      skip,
      take: pageSize,
    });
    const total = this.prisma.post.count();
    return Promise.all([applications, total])
      .then(([data, total]) => {
        const limit = Math.floor(total / pageSize);
        return {
          data,
          total,
          page,
          limit,
        };
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred.');
      });
  }

  async findOne(id: number): Promise<Application> {
    try {
      return await this.prisma.application.findUniqueOrThrow({
        where: {
          id,
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
      const applicationPeriod = await this.prisma.applicationPeriod.findUnique({
        where: {
          id: application.applicationPeriodId,
        },
      });
      if (new Date(applicationPeriod.applicationPeriodEndAt) < new Date()) {
        throw new BadRequestException('A jelentkezési időszak lejárt');
      }
      return await this.prisma.application.delete({
        where: {
          id,
        },
      });
    }
    throw new ForbiddenException('Nem törölheted mások jelentkezését');
  }
}
