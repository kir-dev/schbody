import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';

export enum ApplicationStatus {
  SUBMITTED = 'Benyújtott',
  ACCEPTED = 'Elfogadott',
  REJECTED = 'Elutasított',
  NEEDS_REVIEW = 'Vizsgálat szükséges',
  FINISHED = 'Kiosztott',
}

export type ApplicationEntity = {
  id: number;
  user: UserEntity;
  period: ApplicationPeriodEntity;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationEntity2 = {
  id: number;
  userId: string;
  user: UserEntity;
  applicationPeriodId: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
