import { OmitType } from '@nestjs/swagger';

import { PostEntity } from '../entities/post.entity';

export class SimplePostDto extends OmitType(PostEntity, ['author']) {}
