import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { ApplicationEntity } from '@/types/application-entity';

export default function useCurrentApplication() {
  return useSWR<ApplicationEntity>('/application/last', axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
