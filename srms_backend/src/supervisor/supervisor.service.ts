import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Supervisor } from './supervisor.entity';
import { CreateSupervisorDto, LoginSupervisorDto, UpdateSupervisorDto } from './supervisor.dto';
import { Admin } from '../admin/admin.entity';
import { Asset } from '../entities/shared.entities';
import { MailerService } from '../common/mailer.service';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(Supervisor) private supRepo: Repository<Supervisor>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Asset) private assetRepo: Repository<Asset>,
    private mailerService: MailerService
  ) {}

  async create(dto: CreateSupervisorDto) {
    const exists = await this.supRepo.findOne({ where: { s_username: dto.s_username } });
    if (exists) throw new ConflictException('Username exists');
    const admin = await this.adminRepo.findOne({ where: { a_id: dto.adminId } });
    if (!admin) throw new BadRequestException('Admin not found');
    
    if (dto.s_email) {
        const subject = 'Your Supervisor Account Has Been Created';
        const text = `Welcome, ${dto.s_fullname}.\n\nYour account details:\nUsername: ${dto.s_username}\nPassword: ${dto.s_password}\n\nPlease log in and update your profile immediately.`;
        await this.mailerService.sendMail(dto.s_email, subject, text);
    }
    
    const hashed = await bcrypt.hash(dto.s_password, 10);
    const sup = this.supRepo.create({ ...dto, s_password: hashed, admin } as Partial<Supervisor>);
    return this.supRepo.save(sup);
  }

  findAll() {
    return this.supRepo.find({ relations: ['admin', 'assets'] });
  }

  async findOne(id: number) {
    const sup = await this.supRepo.findOne({ where: { s_id: id }, relations: ['admin', 'assets'] });
    if (!sup) throw new NotFoundException();
    return sup;
  }

  async update(id: number, dto: UpdateSupervisorDto) {
    const sup = await this.findOne(id);
    Object.assign(sup, dto);
    return this.supRepo.save(sup);
  }

  async remove(id: number) {
    const sup = await this.findOne(id);
    return this.supRepo.remove(sup);
  }

  async login(dto: LoginSupervisorDto) {
    const sup = await this.supRepo.findOne({ where: { s_username: dto.s_username } });
    if (!sup) throw new BadRequestException('Invalid credentials');
    const ok = await bcrypt.compare(dto.s_password, sup.s_password);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const payload = { sub: sup.s_id, type: 'supervisor', username: sup.s_username };
    const secret: jwt.Secret = process.env.JWT_SECRET as jwt.Secret || 'your_jwt_secret_here';

    const options: SignOptions = {
      expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
    };

    const token = jwt.sign(payload, secret, options);
    return { token };

  }

  async assignAsset(supervisorId: number, assetId: number) {
    const sup = await this.findOne(supervisorId);
    const asset = await this.assetRepo.findOne({ where: { as_id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    sup.assets = sup.assets || [];
    
    if (!sup.assets.some(a => a.as_id === asset.as_id)) sup.assets.push(asset);
    return this.supRepo.save(sup);
  }
}
