import { UserModule } from './../user/user.module';
import { MailService } from './../mail/mail.service';
import { AuthModule } from './../auth/auth.module';
import { UserService } from '@/user/user.service';
import { AuthService } from './../auth/auth.service';
import { DocumentSchema, DocumentModel } from './model/document.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { JwtModule } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
    JwtModule,
    AuthModule,
    UserModule,
    NestjsFormDataModule,
  ],
  providers: [DocumentService, MailService],
  controllers: [DocumentController],
})
export class DocumentModule {}
