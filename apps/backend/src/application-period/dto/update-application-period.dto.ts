import { PartialType } from '@nestjs/swagger';

import { CreateApplicationPeriodDto } from './create-application-period.dto';

export class UpdateApplicationPeriodDto extends PartialType(CreateApplicationPeriodDto) {}
