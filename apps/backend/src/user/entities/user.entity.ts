import { Role } from '@prisma/client';
import { IsBase64, IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

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
  @IsBase64()
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
