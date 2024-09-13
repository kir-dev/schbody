import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers(query: string, page?: number) {
  if (query.length < 3) {
    if (page) {
      return useSWR<UserEntityPagination>(`users?page=${page}&pageSize=50`, axiosGetFetcher);
    }
    return useSWR<UserEntityPagination>(`users?page=0&pageSize=50`, axiosGetFetcher);
  }
  return useSWR<UserEntityPagination>(`users/search?query=${query}`, axiosGetFetcher);
}
