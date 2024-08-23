import { Module } from '@nestjs/common';
import { ApplicationPeriodModule } from 'src/application-period/application-period.module';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [ApplicationPeriodModule],
})
export class ApplicationModule {}
