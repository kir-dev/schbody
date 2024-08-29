import { Module } from '@nestjs/common';

import { ApplicationPeriodController } from './application-period.controller';
import { ApplicationPeriodService } from './application-period.service';

@Module({
  controllers: [ApplicationPeriodController],
  providers: [ApplicationPeriodService],
  exports: [ApplicationPeriodService],
})
export class ApplicationPeriodModule {}
