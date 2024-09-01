import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
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
}
