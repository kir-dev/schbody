import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';

export enum ApplicationStatus {
  SUBMITTED = 'Benyújtott',
  ACCEPTED = 'Elfogadott',
  REJECTED = 'Elutasított',
  NEEDS_REVIEW = 'Vizsgált',
  FINISHED = 'Kiosztott',
}

export type ApplicationEntityWithPeriod = {
  id: number;
  user: UserEntity;
  period: ApplicationPeriodEntity;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationEntity = {
  id: number;
  userId: string;
  user: UserEntity;
  applicationPeriodId: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
