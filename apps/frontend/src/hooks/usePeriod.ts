import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationPeriodEntity, ApplicationPeriodEntityPagination } from '@/types/application-period-entity';

export function useCurrentPeriod() {
  return useSWR<ApplicationPeriodEntity>('/application-periods/current', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
export function usePeriod(id: number) {
  const shouldFetch = id !== -1;
  return useSWR<ApplicationPeriodEntity>(shouldFetch ? `/application-periods/${id}` : null, axiosGetFetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });
}

const APPLICATION_PERIODS_PAGE_SIZE = 5;
export default function useApplicationPeriods(page: number) {
  return useSWR<ApplicationPeriodEntityPagination>(
    `/application-periods?page=${page}&page_size=${APPLICATION_PERIODS_PAGE_SIZE}`,
    axiosGetFetcher,
    {
      revalidateOnFocus: true,
    }
  );
}
