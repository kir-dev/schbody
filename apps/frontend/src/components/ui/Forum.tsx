'use client';
import React from 'react';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
import LoadingCard from '@/components/ui/LoadingCard';
import NewsCard from '@/components/ui/NewsCard';
import PostCreateOrEditDialog from '@/components/ui/PostCreateOrEditDialog';
import usePosts from '@/hooks/usePosts';
import useProfile from '@/hooks/useProfile';
import { toast } from '@/lib/use-toast';
import { PostEntity } from '@/types/post-entity';
import OwnPagination from '@/components/ui/ownPagination';
import { LuMessageCircle } from 'react-icons/lu';

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

  async function onDelete(id: number) {
    await api.delete(`/posts/${id}`);
    mutate();
  }

  async function onCreateOrEdit(id: number | undefined, title: string, content: string) {
    if (id) {
      await api.patch(`/posts/${id}`, { title, content });
      const newData = posts?.data.map((post) => (post.id === id ? { ...post, title, content } : post));
      await mutate({ data: newData!, total: posts?.total || 0, page: posts?.page || 0, limit: posts?.limit || 0 });
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

  /**
   * If the user is logged in, upvote the post with the given id,
   * else show a toast that only logged in users can upvote.
   * If the user has already upvoted the post, remove the upvote.
   * @param id The id of the post to upvote
   */
  async function onUpvote(id: number) {
    if (!user) {
      toast({
        title: 'Csak bejelentkezett felhasználók upvoteolhatnak!',
        description: 'Jelentkezz be!',
      });
      return;
    }
    await api.post(`/posts/${id}/upvote`);
    await mutate();
  }

  return (
    <div className='space-y-4'>
      {isLoading && <LoadingCard />}
      {user && (user.role === 'BODY_ADMIN' || user.role === 'BODY_MEMBER' || user.role === 'SUPERUSER') && (
        <div className='flex w-full justify-end mt-4'>
          <Button className='max-md:w-full' onClick={() => setIsEditing(undefined)}>
            <LuMessageCircle /> Új hír közzététele
          </Button>
        </div>
      )}
      <PostCreateOrEditDialog p={isEditing} closeDialog={closeDialog} onSave={onCreateOrEdit} />
      {posts?.data &&
        posts.data.map((post: PostEntity) => (
          <NewsCard
            post={post}
            key={post.id}
            onDelete={onDelete}
            onEdit={onEdit}
            onUpvote={onUpvote}
            isLoggedInUser={user ? true : false}
          />
        ))}
      {posts && posts.total > 0 && (
        <OwnPagination
          props={{
            page_size: 10,
            pageIndex: pageIndex,
            setPageIndex: setPageIndex,
            limit: posts.total,
            isLoading: isLoading,
          }}
        />
      )}
    </div>
  );
}
