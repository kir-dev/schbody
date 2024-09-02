import { IsBoolean, IsDateString, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationPeriodDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDateString()
  @IsISO8601()
  applicationPeriodStartAt: Date;
  @IsDateString()
  @IsISO8601()
  applicationPeriodEndAt: Date;
  @IsOptional()
  @IsBoolean()
  ticketsAreValid?: boolean;
}
