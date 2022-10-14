import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './../mail/mail.service';
import { AuthController } from './auth.controller';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stragy';
@Module({
  imports:[UserModule,PassportModule,JwtModule.register({
    secret:"123"
  }),MailerModule],
  providers: [AuthService,JwtStrategy,LocalStrategy,MailService],
  controllers:[AuthController],
  exports:[AuthService,AuthModule]
  
})
export class AuthModule {}
