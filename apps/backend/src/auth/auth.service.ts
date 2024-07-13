import { AuthSchProfile } from '@kir-dev/passport-authsch';
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
        fullName: `${userProfile.lastName} ${userProfile.firstName}`, //this is kinda cring...
        nickName: userProfile.firstName,
        email: userProfile.email,
        isSchResident: true,
        //TODO: Find a solution for only dorm residents. The userProfile.bmeStatus is undefined. Is it an admin enabled info?
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
