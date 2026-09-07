import { ApplicationStatus } from '@prisma/client';
import { IsArray, IsEnum, IsInt } from 'class-validator';

export class BulkUpdateApplicationDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];

  @IsEnum(ApplicationStatus)
  applicationStatus: ApplicationStatus;
}
