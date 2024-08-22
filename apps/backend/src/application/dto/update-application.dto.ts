import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationDto {
  applicationStatus: ApplicationStatus;
}
