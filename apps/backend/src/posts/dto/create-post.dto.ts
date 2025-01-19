import { OmitType } from '@nestjs/swagger';

import { PostEntity } from '../entities/post.entity';

export class CreatePostDto extends OmitType(PostEntity, [
  'id',
  'author',
  'createdAt',
  'updatedAt',
  'upvotes',
  'isUpvoted',
]) {}
