import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  authSchId: string;

  @IsString()
  fullName: string;

  @IsString()
  nickName: string;

  @IsBoolean()
  isSchResident: boolean;

  @IsBoolean()
  isActiveVikStudent: boolean;

  @IsBoolean()
  canHelpNoobs: boolean;
}
