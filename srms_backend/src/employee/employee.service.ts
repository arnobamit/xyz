import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, LoginEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { Supervisor } from '../supervisor/supervisor.entity';
import { RequestInfo } from '../entities/shared.entities';
import { MailerService } from '../common/mailer.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(Supervisor) private supRepo: Repository<Supervisor>,
    @InjectRepository(RequestInfo) private reqRepo: Repository<RequestInfo>,
    private mailerService: MailerService
  ) {}

  async create(dto: CreateEmployeeDto) {
    const exists = await this.empRepo.findOne({ where: { e_username: dto.e_username } });
    if (exists) throw new ConflictException('Username exists');
    const sup = await this.supRepo.findOne({ where: { s_id: dto.supervisorId } });
    if (!sup) throw new BadRequestException('Supervisor not found');
    
    if (dto.e_email) {
        const subject = 'Your Employee Account Has Been Created';
        const text = `Welcome, ${dto.e_fullname}.\n\nYour account details:\nUsername: ${dto.e_username}\nPassword: ${dto.e_password}\n\nPlease log in and update your profile immediately.`;
        await this.mailerService.sendMail(dto.e_email, subject, text);
    }

    const hashed = await bcrypt.hash(dto.e_password, 10);
    const emp = this.empRepo.create({ ...dto, e_password: hashed, supervisor: sup } as Partial<Employee>);
    return this.empRepo.save(emp);
  }

  findAll() {
    return this.empRepo.find({ relations: ['supervisor', 'requests'] });
  }

  async findOne(id: number) {
    const e = await this.empRepo.findOne({ where: { e_id: id }, relations: ['supervisor', 'requests'] });
    if (!e) throw new NotFoundException();
    return e;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.empRepo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    return this.empRepo.remove(e);
  }

  async login(dto: LoginEmployeeDto) {
    const e = await this.empRepo.findOne({ where: { e_username: dto.e_username } });
    if (!e) throw new BadRequestException('Invalid credentials');
    const ok = await bcrypt.compare(dto.e_password, e.e_password);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const payload = { sub: e.e_id, type: 'employee', username: e.e_username };
    const secret: jwt.Secret = process.env.JWT_SECRET as jwt.Secret || 'your_jwt_secret_here';

    const options: SignOptions = {
      expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
    };

    const token = jwt.sign(payload, secret, options);
    return { token };
  }

  async createRequest(employeeId: number, supervisorId: number, r_type: string, r_name: string) {
    const emp = await this.findOne(employeeId);
    const sup = await this.supRepo.findOne({ where: { s_id: supervisorId } });
    if (!sup) throw new BadRequestException('Supervisor not found');
    const req = this.reqRepo.create({ r_type, r_name, r_status: 'open', employee: emp, supervisor: sup } as Partial<RequestInfo>);
    
    if (sup.s_email) {
        const subject = `New Asset Request from ${emp.e_fullname}`;
        const text = `Employee ${emp.e_fullname} (ID: ${emp.e_id}) has submitted a new request.\n\nType: ${r_type}\nName: ${r_name}\n\nAction required.`;
        await this.mailerService.sendMail(sup.s_email, subject, text);
    }
    
    return this.reqRepo.save(req);
  }
}
