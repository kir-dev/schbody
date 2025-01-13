import { CurrentUser, CurrentUserOptional } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/dto/pagination.dto';

import { AnonGuard } from 'src/auth/anon.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { SimplePostDto } from './dto/simple-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @UseGuards(AnonGuard)
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('page_size', ParseIntPipe) pageSize: number,
    @CurrentUserOptional() user?: User
  ): Promise<PaginationDto<SimplePostDto>> {
    return this.postsService.findAll(page, pageSize, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':id/upvote')
  async upvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.upvote(Number(id), user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(Number(id), updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(Number(id));
  }
}
