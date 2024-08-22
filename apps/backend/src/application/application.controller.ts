import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Application, User } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto, @CurrentUser() user: User) {
    return this.applicationService.create(createApplicationDto, user);
  }

  @Get()
  findAll(): Promise<Application[]> {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    return this.applicationService.update(Number(id), updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Application> {
    return this.applicationService.remove(Number(id));
  }
}
