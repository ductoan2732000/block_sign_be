import { SignatureService } from '@/service/sign/signature.service';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
import { SignController } from './controllers/sign/sign.controller';
import { DocumentController } from './controllers/sign/document.controller';
import { SignService } from './service/sign/sign.service';
import { DocumentService } from './service/sign/document.service';
import { SignatureController } from './controllers/sign/signature.controller';
@Module({
  imports: [NestjsFormDataModule, ConfigModule.forRoot()],
  controllers: [SignController, DocumentController, SignatureController],
  providers: [SignService, DocumentService, SignatureService],
})
export class AppModule {}
