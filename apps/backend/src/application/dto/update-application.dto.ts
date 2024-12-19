import { ApplicationStatus } from '@prisma/client';
import { IsArray, IsEnum, IsInt } from 'class-validator';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  applicationStatus: ApplicationStatus;
}

export class UpdateManyApplicationDto {
  @IsEnum(ApplicationStatus)
  applicationStatus: ApplicationStatus;

  @IsArray()
  @IsInt({ each: true })
  idList: number[];
}
