import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplicationPeriod } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateApplicationPeriodDto } from './dto/create-application-period.dto';
import { GetApplicationPeriodsDto } from './dto/get-application-periods.dto';
import { UpdateApplicationPeriodDto } from './dto/update-application-period.dto';

@Injectable()
export class ApplicationPeriodService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(getApplicationPeriodsDto: GetApplicationPeriodsDto) {
    const skip = getApplicationPeriodsDto.page * getApplicationPeriodsDto.page_size;
    return this.prisma.applicationPeriod.findMany({
      skip,
      take: Number(getApplicationPeriodsDto.page_size),
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
      throw new Error('No current application period found');
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
      throw new BadRequestException('Application period not found');
    }
    return period;
  }

  async create(createApplicationPeriodDto: CreateApplicationPeriodDto, user): Promise<ApplicationPeriod> {
    const periods = await this.prisma.applicationPeriod.findMany();
    const newPeriodStart = new Date(createApplicationPeriodDto.applicationPeriodStartAt);
    const newPeriodEnd = new Date(createApplicationPeriodDto.applicationPeriodEndAt);
    periods.forEach((period) => {
      const start = new Date(period.applicationPeriodStartAt);
      const end = new Date(period.applicationPeriodEndAt);
      if (start <= newPeriodEnd && end >= newPeriodStart) {
        throw new BadRequestException('Application period overlaps with another period');
      }
    });
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
      throw new BadRequestException('Application does not exist');
    }
  }

  async update(updateApplicationPeriodDto: UpdateApplicationPeriodDto, id: number): Promise<ApplicationPeriod> {
    const periods = await this.prisma.applicationPeriod.findMany();
    if (
      Boolean(updateApplicationPeriodDto.applicationPeriodStartAt) ||
      Boolean(updateApplicationPeriodDto.applicationPeriodEndAt)
    ) {
      const newPeriodStart = new Date(updateApplicationPeriodDto.applicationPeriodStartAt);
      const newPeriodEnd = new Date(updateApplicationPeriodDto.applicationPeriodEndAt);
      periods.forEach((period) => {
        const start = new Date(period.applicationPeriodStartAt);
        const end = new Date(period.applicationPeriodEndAt);
        if (period.id !== id && start <= newPeriodEnd && end >= newPeriodStart) {
          throw new BadRequestException('Application period overlaps with another period');
        }
      });
    }
    try {
      return this.prisma.applicationPeriod.update({
        where: {
          id,
        },
        data: updateApplicationPeriodDto,
      });
    } catch (e) {
      throw new BadRequestException('Application does not exist');
    }
  }
}
