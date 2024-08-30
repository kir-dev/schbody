import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

export function useCurrentPeriod() {
  return useSWR<ApplicationPeriodEntity>('/application-periods/current', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}

export function usePeriod(id: number) {
  return useSWR<ApplicationPeriodEntity>(`/application-periods/${id}`, axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
