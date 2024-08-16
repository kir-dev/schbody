import { IsInt, IsOptional, Min } from 'class-validator';
export class GetPostsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  page_size: number;
}
