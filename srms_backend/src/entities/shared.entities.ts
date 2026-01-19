import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable
} from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Employee } from '../employee/employee.entity';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  as_id: number;

  @Column()
  as_type: string;

  @Column()
  as_name: string;

  @Column()
  as_status: string;

  @ManyToOne(() => Admin, admin => admin.assets, { nullable: true })
  admin: Admin;

  @ManyToMany(() => Supervisor, supervisor => supervisor.assets)
  @JoinTable({
    name: 'supervisor_assets',
    joinColumn: { name: 'as_id', referencedColumnName: 'as_id' },
    inverseJoinColumn: { name: 's_id', referencedColumnName: 's_id' }
  })
  supervisors: Supervisor[];
}

@Entity('requests')
export class RequestInfo {
  @PrimaryGeneratedColumn()
  r_id: number;

  @Column()
  r_type: string;

  @Column()
  r_name: string;

  @Column()
  r_status: string;

  @ManyToOne(() => Employee, employee => employee.requests, { nullable: false })
  employee: Employee;

  @ManyToOne(() => Supervisor, supervisor => supervisor.requests, { nullable: false })
  supervisor: Supervisor;
}
