import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationPeriod, Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

import { ApplicationPeriodService } from './application-period.service';
import { CreateApplicationPeriodDto } from './dto/create-application-period.dto';
import { GetApplicationPeriodsDto } from './dto/get-application-periods.dto';
import { SimpleApplicationPeriodDto } from './dto/simple-application-period.dto';
import { UpdateApplicationPeriodDto } from './dto/update-application-period.dto';

@Controller('application-periods')
export class ApplicationPeriodController {
  constructor(private readonly applicationPeriodService: ApplicationPeriodService) {}

  @Get()
  async findAll(@Query() getApplicationPeriodsDto: GetApplicationPeriodsDto): Promise<SimpleApplicationPeriodDto[]> {
    return this.applicationPeriodService.findAll(getApplicationPeriodsDto);
  }

  @Get('current')
  async getCurrentPeriod(): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.getCurrentPeriod();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @Post()
  async create(
    @Body() createApplicationPeriodDto: CreateApplicationPeriodDto,
    @CurrentUser() user: User
  ): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.create(createApplicationPeriodDto, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.delete(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @Patch(':id')
  async update(
    @Body() updateApplicationPeriodDto: UpdateApplicationPeriodDto,
    @Param() id: string
  ): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.update(updateApplicationPeriodDto, Number(id));
  }
}
