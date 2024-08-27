import { FiEdit2, FiType, FiUser } from 'react-icons/fi';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostManagementButtons from '@/components/ui/PostManagementButtons';
import { PostEntity } from '@/types/post-entity';

export default function NewsCard({
  post,
  onDelete,
  onEdit,
}: {
  post: PostEntity;
  onEdit: (Post: PostEntity) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div />
      {post && (
        <Card>
          <CardHeader className='relative'>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className='flex gap-8'>
              <p className='flex items-center gap-2'>
                <FiUser />
                {/*todo uncomment when the data arrives*/}
                {/*{post.author.fullName}*/}
              </p>
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
            <PostManagementButtons onDelete={() => onDelete(post.id)} onEdit={() => onEdit(post)} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
