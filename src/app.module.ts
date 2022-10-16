import { SignatureService } from '@/service/sign/signature.service';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
import { SignController } from './controllers/sign/sign.controller';
import { DocumentController } from './controllers/sign/document.controller';
import { SignService } from './service/sign/sign.service';
import { DocumentService } from './service/sign/document.service';
import { SignatureController } from './controllers/sign/signature.controller';
import { ContractController } from './controllers/contract/contract.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContractService } from './service/contract/contract.service';
@Module({
  imports: [
    NestjsFormDataModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://thanh125:thanh125@cluster0.kpev8g5.mongodb.net/?retryWrites=true&w=majority',
    ),
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [
    SignController,
    DocumentController,
    SignatureController,
    ContractController,
  ],
  providers: [SignService, DocumentService, SignatureService, ContractService],
})
export class AppModule {}
