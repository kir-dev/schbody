import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApplicationPeriod, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/dto/pagination.dto';
import { optimizeImage } from 'src/util';

import { CreateApplicationPeriodDto } from './dto/create-application-period.dto';
import { UpdateApplicationPeriodDto } from './dto/update-application-period.dto';

@Injectable()
export class ApplicationPeriodService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(page?: number, pageSize?: number): Promise<PaginationDto<ApplicationPeriod>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const periods = this.prisma.applicationPeriod.findMany({
      skip: hasPagination ? page * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      orderBy: {
        applicationPeriodStartAt: 'desc',
      },
      include: {
        author: {
          select: {
            fullName: true,
            nickName: true,
          },
        },
      },
    });
    const total = this.prisma.post.count();
    return Promise.all([periods, total])
      .then(([data, total]) => {
        const limit = hasPagination ? Math.floor(total / pageSize) : 0;
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
  findApplications(id: number) {
    return this.prisma.application.findMany({
      where: {
        applicationPeriodId: id,
      },
      include: {
        user: {
          select: {
            authSchId: true,
            fullName: true,
            neptun: true,
            isActiveVikStudent: true,
            email: true,
            roomNumber: true,
            isSchResident: true,
            role: true,
            idNumber: true,
          },
        },
      },
    });
  }

  async getCurrentPeriod(): Promise<ApplicationPeriod> {
    const period = await this.prisma.applicationPeriod.findFirst({
      where: {
        applicationPeriodStartAt: {
          lte: new Date(),
        },
        applicationPeriodEndAt: {
          gte: new Date(),
        },
      },
    });
    if (!period) {
      throw new NotFoundException('Nem található aktuális jelentkezési időszak');
    }
    return period;
  }

  async findOne(id: number): Promise<ApplicationPeriod> {
    const period = await this.prisma.applicationPeriod.findUnique({
      where: {
        id,
      },
    });
    if (!period) {
      throw new NotFoundException('Application period not found');
    }
    return period;
  }
  async findPassBackground(periodId: number): Promise<Uint8Array> {
    try {
      const profilePic = await this.prisma.passBackgroundPicture.findUniqueOrThrow({ where: { periodId } });
      return profilePic.backgroundImage;
    } catch (_error) {
      throw new NotFoundException(`Period with id ${periodId} not found`);
    }
  }

  async create(createApplicationPeriodDto: CreateApplicationPeriodDto, user: User): Promise<ApplicationPeriod> {
    try {
      const conflictingPeriod = await this.prisma.applicationPeriod.findFirst({
        where: {
          OR: [
            {
              applicationPeriodStartAt: { lte: createApplicationPeriodDto.applicationPeriodEndAt },
              applicationPeriodEndAt: { gte: createApplicationPeriodDto.applicationPeriodStartAt },
            },
            {
              applicationPeriodStartAt: { gte: createApplicationPeriodDto.applicationPeriodStartAt },
              applicationPeriodEndAt: { lte: createApplicationPeriodDto.applicationPeriodEndAt },
            },
          ],
        },
      });
      if (conflictingPeriod) {
        throw new BadRequestException('Application period overlaps with another period');
      }
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid date format');
      } else if (e instanceof BadRequestException) {
        throw e;
      }
    }
    const startDate = new Date(createApplicationPeriodDto.applicationPeriodStartAt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(createApplicationPeriodDto.applicationPeriodEndAt);
    endDate.setHours(23, 59, 59, 999);
    return this.prisma.applicationPeriod.create({
      data: {
        ...createApplicationPeriodDto,
        applicationPeriodStartAt: startDate,
        applicationPeriodEndAt: endDate,
        author: {
          connect: {
            authSchId: user.authSchId,
          },
        },
      },
    });
  }

  async savePassBg(periodId: number, buffer: Buffer, mimetype: string) {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      throw new BadRequestException('Invalid image format');
    }
    try {
      await this.createOrUpdatePassBg(periodId, buffer);
    } catch (_error) {
      throw new NotFoundException(`Period with id ${periodId} not found`);
    }
  }

  private async createOrUpdatePassBg(periodId: number, backgroundImage: Buffer) {
    const { image, mimeType } = await optimizeImage(backgroundImage, false);
    const data = {
      periodId,
      backgroundImage: image,
      mimeType,
    };
    try {
      await this.prisma.passBackgroundPicture.update({
        where: { periodId },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          await this.prisma.passBackgroundPicture.create({ data });
          return;
        }
      }
      throw e;
    }
  }

  async delete(id: number): Promise<ApplicationPeriod> {
    try {
      return await this.prisma.applicationPeriod.delete({
        where: {
          id,
        },
      });
    } catch (_e) {
      throw new NotFoundException('Application period not found');
    }
  }

  async update(updateApplicationPeriodDto: UpdateApplicationPeriodDto, id: number): Promise<ApplicationPeriod> {
    if (
      Boolean(updateApplicationPeriodDto.applicationPeriodStartAt) ||
      Boolean(updateApplicationPeriodDto.applicationPeriodEndAt)
    ) {
      try {
        const conflictingPeriod = await this.prisma.applicationPeriod.findFirst({
          where: {
            AND: [
              {
                applicationPeriodStartAt: {
                  lte: updateApplicationPeriodDto.applicationPeriodEndAt,
                },
              },
              {
                applicationPeriodEndAt: {
                  gte: updateApplicationPeriodDto.applicationPeriodStartAt,
                },
              },
            ],
          },
        });
        if (conflictingPeriod) {
          throw new BadRequestException('Application period overlaps with another period');
        }
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientValidationError) {
          throw new BadRequestException('Invalid date format');
        }
      }
    }

    try {
      return this.prisma.applicationPeriod.update({
        where: {
          id,
        },
        data: updateApplicationPeriodDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid date format');
      }
      throw new BadRequestException('Application period not found');
    }
  }
}
