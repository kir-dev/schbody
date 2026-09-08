import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';

/**
 * Minden hibás választ kilogol, a kezelt 4xx-eket is - a Nest alapból csak az 5xx-eket írja ki,
 * emiatt egy 4xx-en elbukó kérések eddig nem voltak elérhetőek.
 *
 * A választ változatlanul a BaseExceptionFilter állítja elő, és az ismeretlen
 * hibák stacktrace-ét is az írja ki, ezért itt csak a kontextus sor keletkezik, duplázás nélkül.
 *
 * Sem a request body, sem a fejlécek, sem a query string nem kerül a logba,
 * csak az útvonal és az authSchId.
 */
@Catch()
export class LoggingExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request & { user?: { authSchId?: string } }>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const user = request.user?.authSchId ?? 'anonim';
    const message = `${request.method} ${request.path} -> ${status} (user: ${user}): ${this.describe(exception)}`;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(message);
    } else {
      this.logger.warn(message);
    }

    super.catch(exception, host);
  }

  private describe(exception: unknown): string {
    let raw: string;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      raw = typeof response === 'string' ? response : JSON.stringify(response);
    } else {
      raw = exception instanceof Error ? exception.message : String(exception);
    }
    // A Prisma hibaüzenetek többsorosak, ez fűzi egy sorba őket.
    return raw.replace(/\s+/g, ' ').trim();
  }
}
