import { Role } from '@prisma/client';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class User {
  @IsUUID()
  authSchId: string;
  @IsEnum(Role)
  role: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsBoolean()
  isSchResident: boolean;
  @IsBoolean()
  isActiveVikStudent: boolean;
  @IsNumber()
  @IsPositive()
  roomNumber: number;
  profileImage: any;
  @IsBoolean()
  canHelpNoobs: boolean;
  @IsString()
  publicDesc: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsDate()
  profileSeenAt: Date;
}
