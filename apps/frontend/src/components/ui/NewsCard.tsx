import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PostEntity } from '@/types/post-entity';

export default function NewsCard({ post }: { post: PostEntity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.authorId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter>
        <p>
          {post.createdAt} / {post.updatedAt}
        </p>
      </CardFooter>
    </Card>
  );
}
