import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';

export enum ApplicationStatus {
  SUBMITTED,
  ACCEPTED,
  REJECTED,
  NEEDS_REVIEW,
  FINISHED,
}

export type ApplicationEntity = {
  id: number;
  user: UserEntity;
  period: ApplicationPeriodEntity;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
