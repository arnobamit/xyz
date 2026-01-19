import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Employee } from '../employee/employee.entity';
import { Asset } from '../entities/shared.entities';
import { RequestInfo } from '../entities/shared.entities';

@Entity('supervisor')
export class Supervisor {
  @PrimaryGeneratedColumn()
  s_id: number;

  @Column({ unique: true })
  s_username: string;

  @Column()
  s_password: string;

  @Column()
  s_fullname: string;

  @Column({ nullable: true })
  s_phone: string;

  @Column({ nullable: true })
  s_email: string;

  @Column({ nullable: true })
  s_gender: string;

  @ManyToOne(() => Admin, admin => admin.supervisors, { nullable: false })
  admin: Admin;

  @OneToMany(() => Employee, e => e.supervisor)
  employees: Employee[];

  @ManyToMany(() => Asset, asset => asset.supervisors)
  assets: Asset[];

  @OneToMany(() => RequestInfo, req => req.supervisor)
  requests: RequestInfo[];
}
