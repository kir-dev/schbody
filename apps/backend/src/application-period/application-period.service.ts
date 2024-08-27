import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationPeriod, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateApplicationPeriodDto } from './dto/create-application-period.dto';
import { UpdateApplicationPeriodDto } from './dto/update-application-period.dto';

@Injectable()
export class ApplicationPeriodService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(page: number, pageSize: number) {
    const skip = page * Number(pageSize);
    return this.prisma.applicationPeriod.findMany({
      skip,
      take: Number(pageSize),
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
  }
  findApplications(id: number) {
    return this.prisma.application.findMany({
      where: {
        applicationPeriodId: id,
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

  async create(createApplicationPeriodDto: CreateApplicationPeriodDto, user): Promise<ApplicationPeriod> {
    try {
      const conflictingPeriod = await this.prisma.applicationPeriod.findFirst({
        where: {
          AND: [
            {
              applicationPeriodStartAt: {
                lte: createApplicationPeriodDto.applicationPeriodEndAt,
              },
            },
            {
              applicationPeriodEndAt: {
                gte: createApplicationPeriodDto.applicationPeriodStartAt,
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
    return this.prisma.applicationPeriod.create({
      data: {
        ...createApplicationPeriodDto,
        author: {
          connect: {
            authSchId: user.authSchId,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<ApplicationPeriod> {
    try {
      return await this.prisma.applicationPeriod.delete({
        where: {
          id,
        },
      });
    } catch (e) {
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
