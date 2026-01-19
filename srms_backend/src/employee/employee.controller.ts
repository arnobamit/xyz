import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, LoginEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { EmployeeGuard } from './employee.guard';
import { SupervisorGuard } from 'src/supervisor/supervisor.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private svc: EmployeeService) {}

  @Post('register')
  create(@Body() dto: CreateEmployeeDto) {
    return this.svc.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginEmployeeDto) {
    return this.svc.login(dto);
  }

  @UseGuards(SupervisorGuard)
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @UseGuards(SupervisorGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @UseGuards(SupervisorGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(SupervisorGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @UseGuards(EmployeeGuard)
  @Post(':id/requests')
  createRequest(@Param('id', ParseIntPipe) id: number, @Body() body: { supervisorId: number; r_type: string; r_name: string }) {
    return this.svc.createRequest(id, body.supervisorId, body.r_type, body.r_name);
  }
}