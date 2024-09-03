import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';

export function useUser(id: string) {
  return useSWR(`/user/${id}`, axiosGetFetcher);
}
