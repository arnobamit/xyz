import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset, RequestInfo } from './shared.entities';
import { Admin } from '../admin/admin.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Employee } from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, RequestInfo, Admin, Supervisor, Employee])],
  exports: [TypeOrmModule]
})
export class SharedEntitiesModule {}
