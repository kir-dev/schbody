import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserAdminDto {
  @IsString()
  @IsOptional()
  nickName: string;

  @IsBoolean()
  @IsOptional()
  isSchResident: boolean;

  @IsNumber()
  @IsOptional()
  roomNumber: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  canHelpNoobs: boolean;

  @IsString()
  @IsOptional()
  publicDesc: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
