import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPostDto: CreatePostDto, user: User) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        author: {
          connect: {
            authSchId: user.authSchId,
          },
        },
      },
    });
  }

  findAll(getPostsDto: GetPostsDto) {
    const skip = getPostsDto.page * getPostsDto.page_size;
    return this.prisma.post.findMany({
      skip,
      take: Number(getPostsDto.page_size),
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User) {
    const currentPost = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (currentPost.authorId !== user.authSchId && user.role !== 'BODY_ADMIN') {
      throw new UnauthorizedException('You cannot edit this post!');
    }
    return this.prisma.post.update({
      where: {
        id,
      },
      data: updatePostDto,
    });
  }

  async remove(id: number, user: User) {
    const currentPost = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (currentPost.authorId !== user.authSchId && user.role !== 'BODY_ADMIN') {
      throw new UnauthorizedException('You cannot delete this post!');
    }
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
