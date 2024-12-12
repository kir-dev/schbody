import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers(query: string, page?: number) {
  let requestPath = `users/search?query=${query}`;
  if (query.length < 3) {
    if (page) {
      requestPath = `users?page=${page}&pageSize=50`;
    }
    requestPath = `users?page=0&pageSize=50`;
  }
  return useSWR<UserEntityPagination>(requestPath, axiosGetFetcher);
}
