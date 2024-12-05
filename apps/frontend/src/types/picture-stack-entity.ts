import { UserEntity } from '@/types/user-entity';

export type PictureStackEntity = {
  user: UserEntity;
  mimeType: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};
