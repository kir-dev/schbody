import { IsInt, IsOptional, Min } from 'class-validator';
export class GetApplicationPeriodsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  page_size: number;
}
