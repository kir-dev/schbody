import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntity } from '@/types/user-entity';

export default function useUser() {
  return useSWR<UserEntity>('/users/me', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}

// export function useUser(id: string) {
//   return useSWR(`/user/${id}`, axiosGetFetcher);
// }
