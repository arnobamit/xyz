import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supervisor } from '../supervisor/supervisor.entity';
import { RequestInfo } from '../entities/shared.entities';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column({ unique: true })
  e_username: string;

  @Column()
  e_password: string;

  @Column()
  e_fullname: string;

  @Column({ nullable: true })
  e_phone: string;

  @Column({ nullable: true })
  e_email: string;

  @Column({ nullable: true })
  e_gender: string;

  @ManyToOne(() => Supervisor, sup => sup.employees, { nullable: false })
  supervisor: Supervisor;

  @OneToMany(() => RequestInfo, req => req.employee)
  requests: RequestInfo[];
}
