import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationEntity2 } from '@/types/application-entity';

export default function useApplications(id: number) {
  return useSWR<ApplicationEntity2[]>(`/application-periods/${id}/applications`, axiosGetFetcher);
}
