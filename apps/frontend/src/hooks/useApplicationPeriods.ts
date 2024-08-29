import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationPeriodEntityPagination } from '@/types/application-period-entity';

const APPLICATION_PERIODS_PAGE_SIZE = 5;
export default function useApplicationPeriods(page: number) {
  return useSWR<ApplicationPeriodEntityPagination>(
    `/application-periods?page=${page}&page_size=${APPLICATION_PERIODS_PAGE_SIZE}`,
    axiosGetFetcher
  );
}
