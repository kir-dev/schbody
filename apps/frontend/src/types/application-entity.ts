import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';

export enum ApplicationStatus {
  SUBMITTED = 'Benyújtott',
  ACCEPTED = 'Elfogadott',
  REJECTED = 'Elutasított',
  PREPARED_FOR_PRINT = 'Nyomtatásra kész',
  MANUFACTURED = 'Legyártott',
  DISTRIBUTED = 'Kiosztott',
  WAITING_FOR_OPS = 'Üzemeltetésre vár',
  VALID = 'Érvényes',
  REVOKED = 'Visszavont',
  EXPIRED = 'Lejárt',
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
