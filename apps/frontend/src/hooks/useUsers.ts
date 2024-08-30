import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers() {
  return useSWR<UserEntityPagination>(`users?page=1&pageSize=10`, axiosGetFetcher);
}
