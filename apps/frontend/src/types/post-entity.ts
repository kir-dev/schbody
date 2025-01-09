import { UserEntity } from '@/types/user-entity';

export type PostEntity = {
  id: number;
  title: string;
  content: string;
  visible: boolean;
  author: UserEntity;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostPaginationEntity = {
  data: PostEntity[];
  total: number;
  page: number;
  limit: number;
};
