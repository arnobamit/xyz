import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Admin } from './admin.entity';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from './admin.dto';
import { MailerService } from '../common/mailer.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private mailerService: MailerService
  ) {}

  async create(dto: CreateAdminDto) {
    const exists = await this.adminRepo.findOne({ where: { a_username: dto.a_username } });
    if (exists) throw new ConflictException('Username already exists');
    
    if (dto.a_email) {
        const subject = 'Your Admin Account Has Been Created';
        const text = `Welcome, ${dto.a_fullname}.\n\nYour account details:\nUsername: ${dto.a_username}\nPassword: ${dto.a_password}\n\nPlease log in and update your profile immediately.`;
        await this.mailerService.sendMail(dto.a_email, subject, text);
    }

    const hashed = await bcrypt.hash(dto.a_password, 10);
    const admin = this.adminRepo.create({ ...dto, a_password: hashed } as Partial<Admin>);
    return this.adminRepo.save(admin);
  }

  findAll() {
    return this.adminRepo.find();
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOne({ where: { a_id: id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.findOne(id);
    Object.assign(admin, dto);
    return this.adminRepo.save(admin);
  }

  async remove(id: number) {
    const admin = await this.findOne(id);
    return this.adminRepo.remove(admin);
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { a_username: dto.a_username } });
    if (!admin) throw new BadRequestException('Invalid credentials');
    const ok = await bcrypt.compare(dto.a_password, admin.a_password);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const payload = { sub: admin.a_id, type: 'admin', username: admin.a_username };
    const secret: jwt.Secret = process.env.JWT_SECRET as jwt.Secret || 'your_jwt_secret_here';

    const options: SignOptions = {
      expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
    };

    const token = jwt.sign(payload, secret, options);
    return { token };

  }
}
