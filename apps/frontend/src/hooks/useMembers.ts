import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { MemberEntity } from '@/types/user-entity';

export function useMembers() {
  return useSWR<MemberEntity[]>(`users/members?page=-1&pageSize=-1`, axiosGetFetcher);
}
