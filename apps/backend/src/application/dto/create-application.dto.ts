import { OmitType } from '@nestjs/swagger';

import { Application } from '../entities/application.entity';

export class CreateApplicationDto extends OmitType(Application, [
  'id',
  'status',
  'user',
  'userId',
  'applicationPeriod',
  'createdAt',
  'updatedAt',
]) {}
