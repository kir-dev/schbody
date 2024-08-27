import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Application, ApplicationPeriod, Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationDto } from 'src/dto/pagination.dto';

import { ApplicationPeriodService } from './application-period.service';
import { CreateApplicationPeriodDto } from './dto/create-application-period.dto';
import { UpdateApplicationPeriodDto } from './dto/update-application-period.dto';

@ApiTags('application-periods')
@Controller('application-periods')
export class ApplicationPeriodController {
  constructor(private readonly applicationPeriodService: ApplicationPeriodService) {}

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('page_size', ParseIntPipe) pageSize: number = 10
  ): Promise<PaginationDto<ApplicationPeriod>> {
    return this.applicationPeriodService.findAll(page, pageSize);
  }

  @Get('current')
  async getCurrentPeriod(): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.getCurrentPeriod();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.findOne(id);
  }
  @Get(':id/applications')
  async findApplications(@Param('id', ParseIntPipe) id: number): Promise<Application[]> {
    return this.applicationPeriodService.findApplications(id);
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
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.BODY_ADMIN, Role.BODY_MEMBER)
  @Patch(':id')
  async update(
    @Body() updateApplicationPeriodDto: UpdateApplicationPeriodDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ApplicationPeriod> {
    return this.applicationPeriodService.update(updateApplicationPeriodDto, id);
  }
}
