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

import { BulkUpdateApplicationDto } from './dto/bulk-update-application.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DefaultArgs } from '@prisma/client/runtime/library';

/**
 * A Prisma client scoped to an interactive transaction (the value passed to the
 * `$transaction(async (tx) => ...)` callback).
 */
export type PrismaTransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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

  /**
   * Changes an application's status, refreshes its `updatedAt` timestamp and
   * writes an audit-log entry (`ApplicationStatusLog`) recording who made the
   * change and the previous/new status. A log entry is only written when the
   * status actually changes.
   *
   * @param client - a Prisma client or an interactive transaction client
   * @param application - the current application (must include `id` and `status`)
   * @param newStatus - the status to set
   * @param changedById - `authSchId` of the acting user, or `null` for system-initiated changes
   */
  private async applyStatusChange(
    client: PrismaService | PrismaTransactionClient,
    application: Pick<Application, 'id' | 'status'>,
    newStatus: ApplicationStatus,
    changedById: string | null
  ): Promise<Application> {
    const updated = await client.application.update({
      where: { id: application.id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });
    if (application.status !== newStatus) {
      await client.applicationStatusLog.create({
        data: {
          applicationId: application.id,
          previousStatus: application.status,
          newStatus,
          changedById,
        },
      });
    }
    return updated;
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto, user: User): Promise<Application> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const application = await tx.application.findUniqueOrThrow({ where: { id } });
        return this.applyStatusChange(tx, application, updateApplicationDto.applicationStatus, user.authSchId);
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('A keresett jelentkezés nem található');
        }
      }
      throw e;
    }
  }

  /**
   * Returns the whole status-change audit log (every application), newest first,
   * including the affected application's applicant and who made each change.
   * Used by the admin audit-log page, which does its own filtering/pagination.
   */
  async findAllStatusLogs() {
    return this.prisma.applicationStatusLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: { select: { authSchId: true, fullName: true, nickName: true } },
        application: {
          select: {
            id: true,
            applicationPeriodId: true,
            user: { select: { authSchId: true, fullName: true, nickName: true } },
          },
        },
      },
    });
  }

  /**
   * Returns the audit log of every status change of the given application,
   * newest first, including who made each change.
   */
  async getStatusLogs(id: number) {
    try {
      await this.prisma.application.findUniqueOrThrow({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('A keresett jelentkezés nem található');
      }
      throw e;
    }
    return this.prisma.applicationStatusLog.findMany({
      where: { applicationId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: { select: { authSchId: true, fullName: true, nickName: true } },
      },
    });
  }

  /**
   * Bulk status change: refreshes `updatedAt` and writes an audit-log entry for
   * every application whose status actually changes. Runs in three statements
   * (read current statuses, `updateMany`, `createMany` the log rows) regardless
   * of how many applications are targeted.
   */
  async bulkUpdate(bulkUpdateApplicationDto: BulkUpdateApplicationDto, user: User): Promise<Prisma.BatchPayload> {
    const { ids, applicationStatus } = bulkUpdateApplicationDto;
    return this.prisma.$transaction(async (tx) => {
      const applications = await tx.application.findMany({
        where: { id: { in: ids } },
        select: { id: true, status: true },
      });

      const result = await tx.application.updateMany({
        where: { id: { in: ids } },
        data: { status: applicationStatus, updatedAt: new Date() },
      });

      const logs = applications
        .filter((application) => application.status !== applicationStatus)
        .map((application) => ({
          applicationId: application.id,
          previousStatus: application.status,
          newStatus: applicationStatus,
          changedById: user.authSchId,
        }));
      if (logs.length > 0) {
        await tx.applicationStatusLog.createMany({ data: logs });
      }

      return result;
    });
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
    tx: PrismaTransactionClient,
    changedById: string | null
  ) {
    try {
      const activeApplications = await this.getActiveApplications(userId);
      await Promise.all(
        activeApplications.map((application) => this.applyStatusChange(tx, application, status, changedById))
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
