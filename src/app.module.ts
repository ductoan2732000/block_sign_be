import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SignController } from './controllers/sign/sign.controller';
import { SignService } from './service/sign/sign.service';
@Module({
  imports: [NestjsFormDataModule],
  controllers: [SignController],
  providers: [SignService],
})
export class AppModule {}
