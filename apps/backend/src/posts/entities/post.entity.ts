import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class PostEntity {
  id: number;
  title: string;
  content: string;
  preview: string;
  visible: boolean = true;
  @ApiProperty({ type: User })
  author: User;
  createdAt: Date;
  updatedAt: Date;
}
