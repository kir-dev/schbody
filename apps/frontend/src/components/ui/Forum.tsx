'use client';
import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
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
import PostCreateOrEditDialog from '@/components/ui/PostCreateOrEditDialog';
import usePosts from '@/hooks/usePosts';
import useProfile from '@/hooks/useProfile';
import { PostEntity } from '@/types/post-entity';

export default function Forum() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const { data: posts, isLoading, mutate } = usePosts(pageIndex);
  const [isEditing, setIsEditing] = React.useState<PostEntity | null | undefined>(null);
  const { data: user } = useProfile();

  function onEdit(post: PostEntity) {
    setIsEditing(post);
  }

  function closeDialog() {
    setIsEditing(null);
  }

  function onDelete(id: number) {
    api.delete(`/posts/${id}`);
    mutate(
      posts?.filter((post) => post.id !== id),
      false
    );
  }

  async function onCreateOrEdit(id: number | undefined, title: string, content: string) {
    if (id) {
      await api.patch(`/posts/${id}`, { title, content });
      const newPosts = posts?.map((post) => (post.id === id ? { ...post, title, content } : post));
      await mutate(newPosts, false);
    } else {
      await api.post('/posts', {
        title: title,
        content: content,
        preview: content,
        visible: true,
      });
      await mutate();
    }
  }

  return (
    <div className='space-y-4'>
      {isLoading && <LoadingCard />}
      {user && (user.role === 'BODY_ADMIN' || user.role === 'BODY_MEMBER') && (
        <Button onClick={() => setIsEditing(undefined)}>
          <FiMessageSquare /> Új hír közzététele
        </Button>
      )}
      <PostCreateOrEditDialog p={isEditing} closeDialog={closeDialog} onSave={onCreateOrEdit} />
      {posts &&
        posts.map((post: PostEntity) => <NewsCard post={post} key={post.id} onDelete={onDelete} onEdit={onEdit} />)}
      {posts && posts.length > 0 && (
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
      )}
    </div>
  );
}
