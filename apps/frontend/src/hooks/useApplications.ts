import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationEntity } from '@/types/application-entity';

export default function useApplications(id: number) {
  return useSWR<ApplicationEntity[]>(`/application-periods/${id}/applications`, axiosGetFetcher, {
    refreshInterval: 180000,
  });
}
