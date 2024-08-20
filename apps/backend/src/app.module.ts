import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationPeriodModule } from './application-period/application-period.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), UserModule, AuthModule, ApplicationPeriodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
