import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  authSchId: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  nickName: string;

  @IsBoolean()
  @IsOptional()
  isSchResident: boolean;

  @IsBoolean()
  @IsOptional()
  isActiveVikStudent: boolean;

  @IsBoolean()
  @IsOptional()
  canHelpNoobs: boolean;
}
