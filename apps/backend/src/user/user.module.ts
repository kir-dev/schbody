import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ApplicationModule } from '../application/application.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [ApplicationModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
