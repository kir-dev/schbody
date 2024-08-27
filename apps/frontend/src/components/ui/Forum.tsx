'use client';
import React from 'react';
import useSWR from 'swr';

import NewsCard from '@/components/ui/NewsCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { axiosGetFetcher } from '@/lib/fetchers';
import { PostEntity } from '@/types/post-entity';

export default function Forum() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const { data } = useSWR<PostEntity[]>(`/posts/?page=${pageIndex}&page_size=10`, axiosGetFetcher);
  /*  const getPosts = async (page: number) => {
    const response = await axios.get(`/posts?page=${page}&pageSize=${postsPerPage}`);
    if (response.status === 200) {
      setPosts([...posts, response.data]);
    }
    return response.data;
  };*/

  return (
    <div className='space-y-4 py-16 2xl:mx-64 xl:mx-32 max-xl:mx-8'>
      {data && data.map((post: PostEntity) => <NewsCard post={post} key={post.id} />)}
      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => {
              if (pageIndex === 0) return;
              setPageIndex(pageIndex - 1);
            }}
          >
            <PaginationPrevious href='#' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' isActive>
              {pageIndex + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={() => setPageIndex(pageIndex + 1)}>
            <PaginationNext href='#' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
