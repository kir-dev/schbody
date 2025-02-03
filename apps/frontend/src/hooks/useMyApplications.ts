import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationEntityWithPeriod } from '@/types/application-entity';

export function useMyApplications() {
  return useSWR<ApplicationEntityWithPeriod>('/application/last', axiosGetFetcher);
}

export function useMyAllApplications() {
  return useSWR<ApplicationEntityWithPeriod[]>('/application/all', axiosGetFetcher);
}
