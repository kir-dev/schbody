import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class PostEntity {
  @IsNumber()
  id: number;
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  preview: string;
  @IsOptional()
  @IsBoolean()
  visible: boolean = true;
  @IsNumber()
  likes: number = 0;
  @ApiProperty({ type: User })
  author: User;
  createdAt: Date;
  updatedAt: Date;
}
