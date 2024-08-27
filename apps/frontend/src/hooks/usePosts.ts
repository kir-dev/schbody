import useSWR from 'swr';

import { axiosGetFetcher } from '@/lib/fetchers';
import { PostEntity } from '@/types/post-entity';

export default function usePosts(pageIndex: number) {
  return useSWR<PostEntity[]>(`/posts/?page=${pageIndex}&page_size=10`, axiosGetFetcher);
}
