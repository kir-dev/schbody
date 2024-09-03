import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers(query: string) {
  if (query.length < 3) {
    return useSWR<UserEntityPagination>(`users?page=0&pageSize=300`, axiosGetFetcher);
  }
  return useSWR<UserEntityPagination>(`users/search?query=${query}`, axiosGetFetcher);
}
