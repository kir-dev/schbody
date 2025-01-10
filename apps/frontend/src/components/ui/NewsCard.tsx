import { useState } from 'react';
import { FiEdit2, FiThumbsUp, FiType, FiUser } from 'react-icons/fi';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostManagementButtons from '@/components/ui/PostManagementButtons';
import { PostEntity } from '@/types/post-entity';

export default function NewsCard({
  post,
  onDelete,
  onEdit,
  onUpvote,
}: {
  post: PostEntity;
  onEdit: (Post: PostEntity) => void;
  onDelete: (id: number) => void;
  onUpvote: (id: number) => void;
}) {
  const [readMore, setReadMore] = useState(false);
  const switchDisplayMode = () => setReadMore(!readMore);
  return (
    <div onClick={() => switchDisplayMode()}>
      <div />
      {post && (
        <Card>
          <CardHeader className='relative overflow-hidden'>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className='flex max-md:gap-2 md:gap-8 max-md:flex-col md:flex-row'>
              <span className='flex items-center gap-2'>
                <FiUser />
                {post.author.fullName}
              </span>
              <span className='flex items-center gap-2'>
                <FiType />
                {new Date(post.createdAt).toLocaleDateString('hu-HU', {
                  minute: 'numeric',
                  hour: 'numeric',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
              </span>
              {post.createdAt !== post.updatedAt && (
                <span className='flex items-center gap-2'>
                  <FiEdit2 />
                  {new Date(post.updatedAt).toLocaleDateString('hu-HU', {
                    minute: 'numeric',
                    hour: 'numeric',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                </span>
              )}
              <span className={`flex items-center gap-2 ${post.isUpvoted ? 'text-primary' : ''}`}>
                {/** TODO: Change this to a muscle emoji */}
                <FiThumbsUp onClick={() => onUpvote(post.id)} />
                {post.upvotes}
              </span>
            </CardDescription>
          </CardHeader>
          {!readMore && post.content.length > 250 && (
            <CardContent className='relative'>
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: `${post.content.slice(0, 200)}...` }} />
              <div className='absolute bottom-6 w-full -mx-6 rounded-lg h-12 bg-gradient-to-b from-transparent to-white' />
            </CardContent>
          )}
          {(readMore || post.content.length < 250) && (
            <>
              <CardContent>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardContent>
              <CardFooter>
                <PostManagementButtons onDelete={() => onDelete(post.id)} onEdit={() => onEdit(post)} />
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
