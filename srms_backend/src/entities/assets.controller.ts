import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './shared.entities';
import { AdminGuard } from 'src/admin/admin.guard';
import { SupervisorGuard } from 'src/supervisor/supervisor.guard';

@Controller('assets')
export class AssetsController {
  constructor(@InjectRepository(Asset) private assetRepo: Repository<Asset>) {}

  @UseGuards(AdminGuard)
  @Get('admin')
  findAllForAdmin() {
    return this.assetRepo.find({ relations: ['admin', 'supervisors'] });
  }

  @UseGuards(SupervisorGuard)
  @Get('supervisor')
  findAllForSupervisor() {
    return this.assetRepo.find({ relations: ['admin', 'supervisors'] });
  }

  @UseGuards(AdminGuard)
  @Get('a/:id')
  async findOneForAdmin(@Param('id', ParseIntPipe) id: number) {
    const asset = await this.assetRepo.findOne({ where: { as_id: id }, relations: ['admin', 'supervisors'] });
    if (!asset) throw new HttpException('Asset not found', 404);
    return asset;
  }

  @UseGuards(SupervisorGuard)
  @Get('s/:id')
  async findOneForSupervisor(@Param('id', ParseIntPipe) id: number) {
    const asset = await this.assetRepo.findOne({ where: { as_id: id }, relations: ['admin', 'supervisors'] });
    if (!asset) throw new HttpException('Asset not found', 404);
    return asset;
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: { as_type: string; as_name: string; as_status: string; adminId?: number }) {
    const asset = this.assetRepo.create({
      as_type: body.as_type,
      as_name: body.as_name,
      as_status: body.as_status
    } as Partial<Asset>);
    if (body.adminId) (asset as any).admin = { a_id: body.adminId };
    return this.assetRepo.save(asset);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Asset>) {
    const asset = await this.assetRepo.findOne({ where: { as_id: id } });
    if (!asset) throw new HttpException('Asset not found', 404);
    Object.assign(asset, body);
    return this.assetRepo.save(asset);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const a = await this.assetRepo.findOne({ where: { as_id: id } });
    if (!a) throw new HttpException('Asset not found', 404);
    return this.assetRepo.remove(a);
  }
}
