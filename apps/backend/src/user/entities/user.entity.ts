import { Role } from '@prisma/client';

export class UserEntity {
  authSchId: string;
  fullName: string;
  nickName: string;
  role: Role;
  neptun?: string;
  email?: string;
  isSchResident: boolean;
  isActiveVikStudent: boolean;
  roomNumber?: number;
  profileImage?: Buffer;
  canHelpNoobs: boolean;
  publicDesc?: string;
  createdAt: Date;
  updatedAt: Date;
  profileSeenAt?: Date;
}
