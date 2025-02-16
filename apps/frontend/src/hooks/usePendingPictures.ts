import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { PictureStackEntity } from '@/types/picture-stack-entity';

export function usePendingPictures() {
  return useSWR<PictureStackEntity[]>(`users/profile-pictures/pending`, axiosGetFetcher, {
    revalidateOnFocus: false,
    refreshInterval: 1000000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    shouldRetryOnError: false,
  });
}

/*export function useProilePictureStatus() {
  return useSWR<booelan>;
}*/
