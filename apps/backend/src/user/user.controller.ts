import { CurrentUser } from '@kir-dev/passport-authsch';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfilePictureStatus, Role } from '@prisma/client';
import { ImageParserPipe } from 'src/util';

import { Roles } from '../auth/decorators/Roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findAll(@Query('page', ParseIntPipe) page?: number, @Query('pageSize', ParseIntPipe) pageSize?: number) {
    return this.userService.findMany(page, pageSize);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: User) {
    return this.userService.findOne(user.authSchId);
  }

  @Post('me/profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  async saveProfilePicture(
    @CurrentUser() user: User,
    @UploadedFile(ImageParserPipe)
    file: Express.Multer.File
  ) {
    await this.userService.saveProfilePicture(user.authSchId, file.buffer, file.mimetype);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async updateCurrentUser(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.update(user.authSchId, updateUserDto);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async searchUser(@Query('query') query: string) {
    return this.userService.searchUser(query);
  }
  @Get('members')
  async getMembers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10
  ) {
    return this.userService.findMembers(page, pageSize);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/profile-picture')
  async findProfilePicture(@Param('id') id: string) {
    return new StreamableFile(await this.userService.findProfilePicture(id));
  }

  @Get('profile-pictures/pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  async findPendingProfilePictures() {
    return this.userService.findPendingProfilePictures();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserAdminDto, @CurrentUser() user: User) {
    return this.userService.updateAdmin(id, updateUserDto, user.role);
  }
  @Patch(':id/profile-picture/:status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_MEMBER, Role.BODY_ADMIN)
  async setProfilePictureStatus(@Param('id') id: string, @Param('status') status: ProfilePictureStatus) {
    return this.userService.setProfilePictureStatus(id, status);
  }

  @Post(':id/profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfilePictureAdmin(
    @Param('id') id: string,
    @UploadedFile(ImageParserPipe)
    file: Express.Multer.File
  ) {
    await this.userService.saveProfilePicture(id, file.buffer, file.mimetype);
  }
}
