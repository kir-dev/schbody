import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntityPagination } from '@/types/user-entity';

export function useUsers(query: string, page?: number) {
  let requestPath;
  if (query.length < 3) {
    const pageNumber = page !== undefined ? page : 0;
    requestPath = `users?page=${pageNumber}&pageSize=50`;
  } else {
    requestPath = `users/search?query=${query}`;
  }
  return useSWR<UserEntityPagination>(requestPath, axiosGetFetcher);
}
