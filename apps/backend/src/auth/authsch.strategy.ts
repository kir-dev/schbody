import { AuthSchProfile, AuthSchScope, Strategy } from '@kir-dev/passport-authsch';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';

@Injectable()
export class AuthSchStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientId: process.env.AUTHSCH_CLIENT_ID,
      clientSecret: process.env.AUTHSCH_CLIENT_SECRET,
      scopes: [
        AuthSchScope.PROFILE,
        AuthSchScope.EMAIL,
        AuthSchScope.BME_STATUS,
        process.env.NODE_ENV === 'production' ? [AuthSchScope.NEPTUN] : [],
      ],
      redirectUri: process.env.AUTHSCH_REDIRECT_URI,
    });
  }

  async validate(userProfile: AuthSchProfile): Promise<User> {
    return await this.authService.updateOrCreateUser(userProfile);
  }
}
