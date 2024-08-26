import { UserEntity } from '@/types/user-entity';

export type PostEntity = {
  id: number;
  title: string;
  content: string;
  visible: boolean;
  author: UserEntity;
  createdAt: string;
  updatedAt: string;
};
