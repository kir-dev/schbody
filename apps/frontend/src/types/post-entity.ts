import { UserEntity } from '@/types/user-entity';

export type PostEntity = {
  id: number;
  title: string;
  content: string;
  visible: boolean;
  author: UserEntity;
  upvotes: number;
  isUpvoted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostPaginationEntity = {
  data: PostEntity[];
  total: number;
  page: number;
  limit: number;
};
