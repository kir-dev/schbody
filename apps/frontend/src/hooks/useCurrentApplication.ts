import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationEntityWithPeriod } from '@/types/application-entity';

export default function useCurrentApplication() {
  return useSWR<ApplicationEntityWithPeriod>('/application/my', axiosGetFetcher);
}
