import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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
    try {
      return this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          author: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('This post does not exist.');
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: {
          id,
        },
        data: updatePostDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2000':
            throw new BadRequestException('The content is too long.');
          case 'P2025':
            throw new NotFoundException('This post does not exist.');
        }
      }
      throw new InternalServerErrorException('An error occurred.');
    }
  }

  async remove(id: number) {
    try {
      return this.prisma.post.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2000':
            throw new BadRequestException('The content is too long.');
          case 'P2025':
            throw new NotFoundException('This post does not exist.');
        }
      }
      throw new InternalServerErrorException('An error occurred.');
    }
  }
}
