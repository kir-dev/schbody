import { IsNumberString, IsOptional } from 'class-validator';
export class GetApplicationPeriodsDto {
  @IsOptional()
  @IsNumberString()
  page: number;
  @IsOptional()
  @IsNumberString()
  page_size: string;
}
