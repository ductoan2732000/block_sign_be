import { authConfig } from './../config/auth.config';
import { ForgotPasswordDto } from './../auth/dto/ForgotPassword.dto';
import { UserService } from './../user/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService,private userService: UserService,private jwtService: JwtService) {}
    async sendEmaiForResetPassword(data:ForgotPasswordDto) {
      const {email,userName} = data;
      const userCheck = await this.userService.findUser({email,userName});
      if(userCheck.length === 0) {
        throw new BadRequestException("wrong username or email");
      }
      const token = this.jwtService.sign(data,{secret:authConfig.secretkey});
      const url = `http://localhost:8083/resetpassword/${token}`;
  
      await this.mailerService.sendMail({
        to:email,
        from: "19020630@vnu.edu.vn",
        subject: 'Reset password',
        html:`<a href=${url}><button>Click To Reset</button></a>`
      });
      return "da gui mail"
    }
    
    
  }

