import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Application, ApplicationStatus, Prisma, PrismaClient, Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ApplicationPeriodService } from 'src/application-period/application-period.service';
import { PaginationDto } from 'src/dto/pagination.dto';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DefaultArgs } from '@prisma/client/runtime/library';

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
      const currentUser = await this.prisma.user.findUnique({
        where: { authSchId: user.authSchId, NOT: { profilePicture: null } },
      });
      if (!currentUser) {
        throw new NotAcceptableException('Hiányos profil');
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
      if (e instanceof BadRequestException || e instanceof NotAcceptableException) {
        throw e;
      }
      throw new BadRequestException('Nem sikerült létrehozni');
    }
  }

  async findAll(page: number, pageSize: number): Promise<PaginationDto<Application>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const applications = this.prisma.application.findMany({
      skip: hasPagination ? page * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
    });
    const total = this.prisma.post.count();
    return Promise.all([applications, total])
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

  /**
   * Retrieves the current user's application for the current application period.
   *
   * @param {User} user - The user whose application is to be retrieved.
   * @returns {Promise<Application>} - The user's application for the current application period.
   * @throws {NotFoundException} - If no application is found for the user in the current application period.
   */
  async getCurrentUserApplication(user: User): Promise<Application> {
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

  /**
   * Gets the last submitted application of the user, if it exists, and includes the period
   * the application was submitted in.
   * It doesn't take into consideration the current application period.
   * @param {User} user - The user whose application is to be retrieved.
   * @returns {Promise<Application>} - The last submitted application of the user.
   * @throws {NotFoundException} - if the user has no applications
   */
  async getLastUserApplication(
    user: User
  ): Promise<Prisma.ApplicationGetPayload<{ include: { applicationPeriod: true } }>> {
    try {
      return await this.prisma.application.findFirstOrThrow({
        where: {
          userId: user.authSchId,
        },
        orderBy: {
          applicationPeriod: {
            applicationPeriodEndAt: 'desc',
          },
        },
        include: {
          applicationPeriod: true,
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
    if (
      application.userId === user.authSchId ||
      user.role === Role.BODY_ADMIN ||
      user.role === Role.BODY_MEMBER ||
      user.role === Role.SUPERUSER
    ) {
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

  async getActiveApplications(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId,
        status: {
          in: ['ACCEPTED', 'REJECTED', 'SUBMITTED'],
        },
      },
    });
  }

  async setActiveApplicationsStatus(
    userId: string,
    status: ApplicationStatus,
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
    try {
      const activeApplications = await this.getActiveApplications(userId);
      await Promise.all(
        activeApplications.map((application) =>
          tx.application.update({
            where: { id: application.id },
            data: { status: status },
          })
        )
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User not found`);
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
