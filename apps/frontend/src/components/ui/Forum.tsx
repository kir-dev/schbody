'use client';
import React from 'react';

import LoadingCard from '@/components/ui/LoadingCard';
import NewsCard from '@/components/ui/NewsCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import usePosts from '@/hooks/usePosts';
import { PostEntity } from '@/types/post-entity';

export default function Forum() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const { data: posts, isLoading } = usePosts(pageIndex);

  return (
    <div className='space-y-4 py-16 2xl:mx-64 xl:mx-32 max-xl:mx-8'>
      {isLoading && <LoadingCard />}
      {posts && posts.map((post: PostEntity) => <NewsCard post={post} key={post.id} />)}
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
