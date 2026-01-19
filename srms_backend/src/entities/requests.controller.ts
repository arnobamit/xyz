import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestInfo } from './shared.entities';
import { SupervisorGuard } from 'src/supervisor/supervisor.guard';
import { MailerService } from '../common/mailer.service';

@Controller('requests')
export class RequestsController {
  constructor(
    @InjectRepository(RequestInfo) private reqRepo: Repository<RequestInfo>,
    private mailerService: MailerService,
  ) {}

  @UseGuards(SupervisorGuard)
  @Get()
  findAll() {
    return this.reqRepo.find({ relations: ['employee', 'supervisor'] });
  }

  @UseGuards(SupervisorGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const r = await this.reqRepo.findOne({ where: { r_id: id }, relations: ['employee', 'supervisor'] });
    if (!r) throw new HttpException('Request not found', 404);
    return r;
  }

  @UseGuards(SupervisorGuard)
  @Post()
  create(@Body() body: { r_type: string; r_name: string; r_status?: string; employeeId: number; supervisorId: number }) {
    const req = this.reqRepo.create({
      r_type: body.r_type,
      r_name: body.r_name,
      r_status: body.r_status || 'open',
      employee: { e_id: body.employeeId } as any,
      supervisor: { s_id: body.supervisorId } as any
    } as Partial<RequestInfo>);
    return this.reqRepo.save(req);
  }

  @UseGuards(SupervisorGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<RequestInfo>) {
    const r = await this.reqRepo.findOne({ 
      where: { r_id: id },
      relations: ['employee']
    });
    if (!r) throw new HttpException('Request not found', 404);
    
    const oldStatus = r.r_status;
    const newStatus = body.r_status;

    Object.assign(r, body);
    const updatedRequest = await this.reqRepo.save(r);

    if (newStatus && newStatus !== oldStatus && updatedRequest.employee.e_email) {
        let subject = `Asset Request Update: ${updatedRequest.r_name}`;
        let text = `Your request for "${updatedRequest.r_name}" (${updatedRequest.r_type}) has been reviewed.\n\n`;
        
        if (newStatus === 'accepted') {
            text += '**Status: ACCEPTED**\n\nPlease check with your supervisor for asset delivery details.';
            subject = 'Asset Request Accepted';
        } else if (newStatus === 'rejected') {
            text += '**Status: REJECTED**\n\nYour request was not approved. Please contact your supervisor for further details.';
            subject = 'Asset Request Rejected';
        } else {
            // Catch-all for other status changes if needed
            text += `Status: ${newStatus}`;
            subject = `Asset Request Status Changed to ${newStatus}`;
        }

        await this.mailerService.sendMail(updatedRequest.employee.e_email, subject, text);
    }

    return updatedRequest;
  }

  @UseGuards(SupervisorGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const r = await this.reqRepo.findOne({ where: { r_id: id } });
    if (!r) throw new HttpException('Request not found', 404);
    return this.reqRepo.remove(r);
  }
}
