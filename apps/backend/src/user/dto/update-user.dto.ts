import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickName: string;

  @IsBoolean()
  @IsOptional()
  isSchResident: boolean;

  @IsBoolean()
  @IsOptional()
  isActiveVikStudent: boolean;
}
