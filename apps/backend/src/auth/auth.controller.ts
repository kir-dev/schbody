import { CurrentUser } from '@kir-dev/passport-authsch';
import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * Redirects to the authsch login page
   */
  @UseGuards(AuthGuard('authsch'))
  @Get('login')
  login() {
    // never called
  }

  /**
   * Endpoint for authsch to call after login
   * Redirects to the frontend with the jwt token
   */
  @Get('callback')
  @UseGuards(AuthGuard('authsch'))
  @Redirect()
  oauthRedirect(@CurrentUser() user: User) {
    const jwt = this.authService.login(user);
    return {
      url: `${process.env.FRONTEND_URL}?jwt=${jwt}`,
    };
  }
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  me(@CurrentUser() user: User): User {
    return user;
  }
}
