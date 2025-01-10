import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/dto/pagination.dto';

import { CreatePostDto } from './dto/create-post.dto';
import { SimplePostDto } from './dto/simple-post.dto';
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

  findAll(page?: number, pageSize?: number, user?: User): Promise<PaginationDto<SimplePostDto>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const posts = this.prisma.post.findMany({
      skip: hasPagination ? page * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      where: {
        visible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            fullName: true,
            nickName: true,
          },
        },
        upvotes: true,
      },
    });
    const total = this.prisma.post.count();
    return Promise.all([posts, total])
      .then(([posts, total]) => {
        const limit = hasPagination ? Math.floor(total / pageSize) : 0;
        const postsWithUpvotes = posts.map((post) => {
          const upvotes = post.upvotes.length;
          return {
            ...post,
            upvotes,
            isUpvoted: user ? post.upvotes.some((upvote) => upvote.userId === user.authSchId) : false,
          };
        });
        return {
          data: postsWithUpvotes,
          total,
          page,
          limit,
        };
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred.');
      });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          author: {
            select: {
              fullName: true,
              nickName: true,
            },
          },
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
      return await this.prisma.post.delete({
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

  async upvote(id: number, user: User) {
    try {
      const postToUpvote = await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          upvotes: true,
        },
      });

      const hasUpvoted = postToUpvote.upvotes.some((upvote) => upvote.userId === user.authSchId);

      // If the user has already upvoted, remove the upvote
      if (hasUpvoted) {
        const upvoteId = postToUpvote.upvotes.find((upvote) => upvote.userId === user.authSchId).id;

        return this.prisma.post.update({
          where: {
            id,
          },
          data: {
            upvotes: {
              disconnect: {
                id: upvoteId,
              },
            },
          },
        });
      }

      // Else, add the upvote
      return this.prisma.post.update({
        where: {
          id,
        },
        data: {
          upvotes: {
            create: {
              userId: user.authSchId,
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2025':
            throw new NotFoundException('This post does not exist.');
        }
      }
      throw new InternalServerErrorException('An error occurred.');
    }
  }
}
