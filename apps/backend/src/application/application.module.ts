import { Module } from '@nestjs/common';
import { ApplicationPeriodModule } from 'src/application-period/application-period.module';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [ApplicationPeriodModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
