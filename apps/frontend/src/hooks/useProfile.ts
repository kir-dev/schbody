import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntity } from '@/types/user-entity';

export default function useProfile(): {
  data: UserEntity | undefined;
  isLoading: boolean;
  mutate: () => void;
  error: unknown;
} {
  return useSWR<UserEntity>('/auth/me', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
