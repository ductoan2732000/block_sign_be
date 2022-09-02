import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config';
import { SignController } from './controllers/sign/sign.controller';
import { SignService } from './service/sign/sign.service';
@Module({
  imports: [NestjsFormDataModule, ConfigModule.forRoot()],
  controllers: [SignController],
  providers: [SignService],
})
export class AppModule {}
