import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationStatusLogEntity } from '@/types/application-status-log-entity';

export function useApplicationStatusLogs() {
  return useSWR<ApplicationStatusLogEntity[]>('/application/status-logs', axiosGetFetcher, {
    refreshInterval: 180000,
  });
}
