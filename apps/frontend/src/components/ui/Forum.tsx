'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

import NewsCard from '@/components/ui/NewsCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PostEntity } from '@/types/post-entity';

export default function Forum() {
  const postsPerPage = 10;
  const currentPage = 1;
  const numberOfPages = 3;
  const [pageFrom, setPageFrom] = useState<number>(1);
  const [pageTo, setPageTo] = useState<number>(3);
  const [posts, setPosts] = useState<PostEntity[]>([]);

  useEffect(() => {
    setPageFrom(currentPage > 2 ? currentPage - 2 : 1);
    setPageTo(currentPage < numberOfPages - 2 ? numberOfPages - 2 : numberOfPages);
  }, [currentPage, numberOfPages]);
  const getPosts = async (page: number) => {
    const response = await axios.get(`/posts?page=${page}&pageSize=${postsPerPage}`);
    if (response.status === 200) {
      setPosts([...posts, response.data]);
    }
    return response.data;
  };
  return (
    <div>
      {posts.map((post) => (
        <NewsCard key={post.id} post={post} />
      ))}
      <Pagination>
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
      </Pagination>
    </div>
  );
}
