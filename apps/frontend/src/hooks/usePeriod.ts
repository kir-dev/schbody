import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

export default function usePeriod() {
  return useSWR<ApplicationPeriodEntity>('/application-periods/current', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
