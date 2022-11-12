import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
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
  }),UserModule,JwtModule],
  providers: [MailService],
  exports:[MailService,MailModule]
})
export class MailModule {}
