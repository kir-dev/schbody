import { FiEdit2, FiType } from 'react-icons/fi';
import useSWR from 'swr';

import api from '@/components/network/apiSetup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostManagementButtons from '@/components/ui/PostManagementButtons';
import { axiosGetFetcher } from '@/lib/fetchers';
import { PostEntity } from '@/types/post-entity';

export default function NewsCard({ index }: { index: number } /*{ post }: { post: PostEntity }*/) {
  async function onDelete() {
    await api.delete(`/posts/${index}`);
  }

  const onEdit = async () => {
    await api.patch(`/posts/${index}`);
  };

  const { data: post, isLoading } = useSWR<PostEntity>(`/posts/${index}`, axiosGetFetcher);

  return (
    <>
      <div />
      {post && (
        <Card>
          <CardHeader className='relative'>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className='flex gap-8'>
              {post.author.fullName}
              <p className='flex items-center gap-2'>
                <FiType />
                {post.createdAt.toString().slice(0, 10)}
              </p>
              <p className='flex items-center gap-2'>
                <FiEdit2 />
                {post.updatedAt.toString().slice(0, 10)}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
          </CardContent>
          <CardFooter>
            <PostManagementButtons onDelete={onDelete} onEdit={onEdit} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
