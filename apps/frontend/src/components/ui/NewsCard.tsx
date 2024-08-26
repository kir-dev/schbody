import { FiEdit2, FiType } from 'react-icons/fi';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostManagementButtons from '@/components/ui/PostManagementButtons';
import { PostEntity } from '@/types/post-entity';

export default function NewsCard({ post }: { post: PostEntity }) {
  return (
    <Card>
      <CardHeader className='relative'>
        <PostManagementButtons />
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.authorId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className='gap-8'>
        <p className='flex items-center gap-2'>
          <FiType />
          {post.createdAt}
        </p>
        <p className='flex items-center gap-2'>
          <FiEdit2 />
          {post.updatedAt}
        </p>
      </CardFooter>
    </Card>
  );
}
