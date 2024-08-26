import { IsNumber, IsPositive } from 'class-validator';

export class CreateApplicationDto {
  @IsNumber()
  @IsPositive()
  applicationPeriodId: number;
}
