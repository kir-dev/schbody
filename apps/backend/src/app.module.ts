import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { ApplicationPeriodModule } from './application-period/application-period.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PostsModule,
    ApplicationPeriodModule,
    ApplicationModule,
  ],

  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
