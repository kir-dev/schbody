'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import NewsCard from './NewsCard';

export default function Forum() {
  /*  const postsPerPage = 10;
  const currentPage = 1;
  const numberOfPages = 3;*/
  const [count, setCount] = useState(0);
  const pages: React.JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    pages.push(<NewsCard index={i} />);
  }

  /*  const getPosts = async (page: number) => {
    const response = await axios.get(`/posts?page=${page}&pageSize=${postsPerPage}`);
    if (response.status === 200) {
      setPosts([...posts, response.data]);
    }
    return response.data;
  };*/

  return (
    <div className='space-y-4 py-16 2xl:mx-64 xl:mx-32 max-xl:mx-8'>
      {pages}
      <Button className='w-full' onClick={() => setCount(count + 5)}>
        {' '}
        Még több{' '}
      </Button>
      {/*      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='#' />
          </PaginationItem>
          {Array.from({ length: pageTo - pageFrom + 1 }, (_, i) => i + pageFrom).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href='#' isActive={currentPage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {numberOfPages > pageTo && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href='#' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>*/}
    </div>
  );
}
