import { MailService } from '@/mail/mail.service';
import { DocumentService } from '@/document/document.service';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { SignSchema, SignModel } from './model/sign.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SignService } from './sign.service';
import { SignController } from './sign.controller';
import { JwtModule } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DocumentSchema, DocumentModel } from '@/document/model/document.model';
import { DocumentController } from '@/document/document.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SignModel.name, schema: SignSchema },
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
    JwtModule,
    AuthModule,
    UserModule,
    NestjsFormDataModule,
  ],
  providers: [SignService, DocumentService, MailService],
  controllers: [SignController],
})
export class SignModule {}
