import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

const APPLICATION_PERIODS_PAGE_SIZE = 10;
export default function useApplicationPeriods(page: string) {
  return useSWR<ApplicationPeriodEntity[]>(
    `/application-periods?page=${page}&page_size=${APPLICATION_PERIODS_PAGE_SIZE}`,
    axiosGetFetcher
  );
}
