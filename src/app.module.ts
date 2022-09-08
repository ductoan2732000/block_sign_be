import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
import { SignController } from './controllers/sign/sign.controller';
import { DocumentController } from './controllers/sign/document.controller';
import { SignService } from './service/sign/sign.service';
import { DocumentService } from './service/sign/document.service';
@Module({
  imports: [NestjsFormDataModule, ConfigModule.forRoot()],
  controllers: [SignController, DocumentController],
  providers: [SignService, DocumentService],
})
export class AppModule {}
