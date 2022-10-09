import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { UserService } from './../user/user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports:[MailerModule.forRoot({
    transport: {
      host: 'smtp.sendgrid.net',
      secure: false,
      auth: {
        user: 'apikey',
        pass: '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',
      },
    },
    defaults: {
      from: '"No Reply" <noreply@example.com>',
    },
  }),UserModule,JwtModule.register({
    secret:"123"
  })],
  providers: [MailService],
  exports:[MailService,MailModule]
})
export class MailModule {}
