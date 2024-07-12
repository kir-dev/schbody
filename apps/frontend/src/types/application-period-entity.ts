import { UserEntity } from '@/types/user-entity';

export type ApplicationPeriodEntity = {
  id: number;
  name: string;
  applicationStart: Date;
  applicationEnd: Date;
  ticketsAreValid: boolean;
  author: UserEntity;
  createdAt: Date;
  updatedAt: Date;
};
