import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supervisor } from './supervisor.entity';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { Admin } from '../admin/admin.entity';
import { Asset } from '../entities/shared.entities';
import { MailerService } from '../common/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supervisor, Admin, Asset])],
  controllers: [SupervisorController],
  providers: [SupervisorService, MailerService],
  exports: [SupervisorService]
})
export class SupervisorModule {}
