import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers() {
  return useSWR<UserEntityPagination>(`users?page=0&pageSize=100`, axiosGetFetcher);
}
