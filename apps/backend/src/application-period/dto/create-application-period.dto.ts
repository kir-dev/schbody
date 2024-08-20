import { IsBoolean, IsDateString, IsISO8601, IsOptional } from 'class-validator';

export class CreateApplicationPeriodDto {
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
