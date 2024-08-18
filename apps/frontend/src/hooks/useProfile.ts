import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { UserEntity } from '@/types/user-entity';

export default function useProfile() {
  return useSWR<UserEntity>(`/auth/me`, axiosGetFetcher);
}
