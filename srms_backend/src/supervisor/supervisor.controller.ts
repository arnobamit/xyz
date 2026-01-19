import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { CreateSupervisorDto, LoginSupervisorDto, UpdateSupervisorDto } from './supervisor.dto';
import { AdminGuard } from 'src/admin/admin.guard';
import { SupervisorGuard } from './supervisor.guard';

@Controller('supervisor')
export class SupervisorController {
  constructor(private svc: SupervisorService) {}

  @UseGuards(AdminGuard)
  @Post('register')
  create(@Body() dto: CreateSupervisorDto) {
    return this.svc.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginSupervisorDto) {
    return this.svc.login(dto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @UseGuards(SupervisorGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupervisorDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @UseGuards(SupervisorGuard)
  @Post(':id/assign-asset/:assetId')
  assignAsset(@Param('id', ParseIntPipe) id: number, @Param('assetId', ParseIntPipe) assetId: number) {
    return this.svc.assignAsset(id, assetId);
  }
}
