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
          <CardHeader className='relative overflow-hidden'>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className='flex max-md:gap-2 md:gap-8 max-md:flex-col md:flex-row'>
              <p className='flex items-center gap-2'>
                <FiUser />
                {post.author.fullName}
              </p>
              <p className='flex items-center gap-2'>
                <FiType />
                {new Date(post.createdAt).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
              </p>
              {post.createdAt !== post.updatedAt && (
                <p className='flex items-center gap-2'>
                  <FiEdit2 />
                  {new Date(post.updatedAt).toLocaleDateString('hu-HU', {
                    minute: 'numeric',
                    hour: 'numeric',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
          <CardFooter>
            <PostManagementButtons onDelete={() => onDelete(post.id)} onEdit={() => onEdit(post)} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
