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
  userId: string;
  user: UserEntity;
  applicationPeriodId: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
