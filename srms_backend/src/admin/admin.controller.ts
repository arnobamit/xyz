import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Patch, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from './admin.dto';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private svc: AdminService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateAdminDto) {
    return this.svc.create(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginAdminDto) {
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

  @UseGuards(AdminGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.svc.update(id, dto); 
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
