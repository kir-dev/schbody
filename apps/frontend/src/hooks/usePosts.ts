import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { PostPaginationEntity } from '@/types/post-entity';

export default function usePosts(pageIndex: number) {
  return useSWR<PostPaginationEntity>(`/posts/?page=${pageIndex}&page_size=5`, axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
