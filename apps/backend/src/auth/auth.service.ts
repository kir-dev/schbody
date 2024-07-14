import { AuthSchProfile, BmeUnitScope } from '@kir-dev/passport-authsch';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async findOrCreateUser(userProfile: AuthSchProfile): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { authSchId: userProfile.authSchId } });
    if (user) return user;
    return await this.prisma.user.create({
      data: {
        authSchId: userProfile.authSchId,
        fullName: userProfile.displayName,
        nickName: userProfile.firstName,
        email: userProfile.email,
        isSchResident: true,
        //TODO: Find a solution for only dorm residents.
        isActiveVikStudent: userProfile.bmeStatus.includes(BmeUnitScope.BME_VIK_ACTIVE),
      },
    });
  }

  login(user: User): string {
    return this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7 days',
    });
  }
}
