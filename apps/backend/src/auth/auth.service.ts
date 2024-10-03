import { AuthSchProfile, BmeUnitScope } from '@kir-dev/passport-authsch';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async updateOrCreateUser(userProfile: AuthSchProfile): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { authSchId: userProfile.authSchId },
        data: {
          isActiveVikStudent: userProfile.bme.bmeStatus.includes(BmeUnitScope.BME_VIK_ACTIVE),
          vikStatusUpdatedAt: new Date(),
          neptun: userProfile.bme.neptun,
          //Since we need to deal with the users, who logged in and edited their neptun before this update
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return await this.prisma.user.create({
            data: {
              authSchId: userProfile.authSchId,
              fullName: userProfile.fullName,
              nickName: userProfile.firstName,
              email: userProfile.email,
              isSchResident: true,
              neptun: userProfile.bme.neptun,
              //TODO: Find a solution for only dorm residents.
              isActiveVikStudent: userProfile.bme.bmeStatus.includes(BmeUnitScope.BME_VIK_ACTIVE),
            },
          });
        }
      }
      throw e;
    }
  }

  login(user: User): string {
    return this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7 days',
    });
  }
}
