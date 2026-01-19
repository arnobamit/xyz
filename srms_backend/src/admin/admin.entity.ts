import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Asset } from '../entities/shared.entities';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  a_id: number;

  @Column({ unique: true })
  a_username: string;

  @Column()
  a_password: string;

  @Column()
  a_fullname: string;

  @Column({ nullable: true })
  a_phone: string;

  @Column({ nullable: true })
  a_email: string;

  @Column({ nullable: true })
  a_gender: string;

  @OneToMany(() => Supervisor, sup => sup.admin)
  supervisors: Supervisor[];

  @OneToMany(() => Asset, asset => asset.admin)
  assets: Asset[];
}
