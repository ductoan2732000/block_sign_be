import { RefreshTokenStrategy } from './refreshToken.strategy';
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
import { authConfig } from '@/config/auth.config';
@Module({
  imports:[UserModule,PassportModule,JwtModule,MailerModule],
  providers: [AuthService,JwtStrategy,LocalStrategy,MailService,RefreshTokenStrategy],
  controllers:[AuthController],
  exports:[AuthService,AuthModule]
  
})
export class AuthModule {}
