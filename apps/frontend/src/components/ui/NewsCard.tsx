import { useState } from 'react';
import { LuBicepsFlexed, LuPencil, LuType, LuUser } from 'react-icons/lu';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostManagementButtons from '@/components/ui/PostManagementButtons';
import { PostEntity } from '@/types/post-entity';
import { motion } from 'framer-motion';

function getReadMoreText(readMore: boolean, switchDisplayMode: () => void) {
  if (readMore) {
    return (
      <span className='cursor-pointer font-bold italic underline' onClick={switchDisplayMode}>
        Kevesebb
      </span>
    );
  }
  return (
    <span className='cursor-pointer font-bold italic underline' onClick={switchDisplayMode}>
      Több
    </span>
  );
}

export default function NewsCard({
  post,
  onDelete,
  onEdit,
  onUpvote,
  isLoggedInUser,
}: {
  post: PostEntity;
  onEdit: (Post: PostEntity) => void;
  onDelete: (id: number) => void;
  onUpvote: (id: number) => void;
  isLoggedInUser: boolean;
}) {
  const [readMore, setReadMore] = useState(false);
  const switchDisplayMode = () => setReadMore(!readMore);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div>
      <div />
      {post && (
        <Card>
          <CardHeader className='relative overflow-hidden'>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line react/no-danger */}
            {(readMore || post.content.length < 250) && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
            {post.content.length >= 250 && !readMore && (
              <div>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: `${post.content.slice(0, 200)} . . .` }} />
              </div>
            )}

            {post.content.length >= 250 && getReadMoreText(readMore, switchDisplayMode)}
          </CardContent>
          <CardFooter className='flex max-md:gap-2 md:gap-8 max-sm:flex-col justify-between text-sm text-muted-foreground items-center'>
            <div className='flex max-md:gap-2 md:gap-8 max-sm:flex-col items-center'>
              <span className='flex items-center gap-2'>
                <LuUser />
                {post.author.fullName}
              </span>
              <span className='flex items-center gap-2'>
                <LuType />
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
                  <LuPencil />
                  {new Date(post.updatedAt).toLocaleDateString('hu-HU', {
                    minute: 'numeric',
                    hour: 'numeric',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                </span>
              )}
              <PostManagementButtons onDelete={() => onDelete(post.id)} onEdit={() => onEdit(post)} />
            </div>
            <motion.button
              className={`flex items-center gap-2 py-1 px-1.5 rounded-md border  ${
                isLoggedInUser && 'hover:cursor-pointer hover:bg-gray-50 hover:border-gray-200'
              } ${post.isUpvoted ? 'text-blue-950 ' : 'text-muted-foreground'}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsAnimating(true);
                onUpvote(post.id);
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isAnimating ? { skewX: [0, -10, 0, 0] } : {}}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                onAnimationComplete={() => setIsAnimating(false)} // Reset animation state
              >
                <LuBicepsFlexed className={post.isUpvoted ? 'fill-amber-300 text-amber-900' : ''} />
              </motion.div>
              {post.upvotes}
            </motion.button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
