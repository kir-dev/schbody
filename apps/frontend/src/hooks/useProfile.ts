import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntity } from '@/types/user-entity';

export default function useProfile(): { data: UserEntity; isLoading: boolean; mutate: () => void } {
  return useSWR<UserEntity>('/auth/me', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
