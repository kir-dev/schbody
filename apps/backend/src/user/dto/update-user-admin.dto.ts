import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
