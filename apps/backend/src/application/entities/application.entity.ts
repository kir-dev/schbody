import { ApplicationPeriod, ApplicationStatus, User } from '@prisma/client';

export class Application {
  id: number;
  user: User;
  userId: string;
  applicationPeriod: ApplicationPeriod;
  applicationPeriodId: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}
