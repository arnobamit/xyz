import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset, RequestInfo } from './shared.entities';
import { AssetsController } from './assets.controller';
import { RequestsController } from './requests.controller';
import { MailerService } from '../common/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, RequestInfo])],
  controllers: [AssetsController, RequestsController],
  providers: [MailerService]
})
export class EntitiesModule {}
