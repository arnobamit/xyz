import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Supervisor } from '../supervisor/supervisor.entity';
import { RequestInfo } from '../entities/shared.entities';
import { MailerService } from '../common/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Supervisor, RequestInfo])],
  controllers: [EmployeeController],
  providers: [EmployeeService, MailerService],
  exports: [EmployeeService]
})
export class EmployeeModule {}
