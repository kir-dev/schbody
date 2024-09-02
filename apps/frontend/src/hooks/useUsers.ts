import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers(size?: number) {
  if (!size) size = 1000;
  return useSWR<UserEntityPagination>(`users?page=0&pageSize=${size}`, axiosGetFetcher);
}
