import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AdminModule } from './admin/admin.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { EmployeeModule } from './employee/employee.module';
import { EntitiesModule } from './entities/entities.module';
import { Admin } from './admin/admin.entity';
import { Supervisor } from './supervisor/supervisor.entity';
import { Employee } from './employee/employee.entity';
import { Asset, RequestInfo } from './entities/shared.entities';
import { MailerService } from './common/mailer.service';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '12345',
      database: process.env.DATABASE_NAME || 'srms',
      entities: [Admin, Supervisor, Employee, Asset, RequestInfo],
      synchronize: true
    }),
    AdminModule,
    SupervisorModule,
    EmployeeModule,
    EntitiesModule
  ],
  providers: [MailerService],
})
export class AppModule {}
