import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from './../mail/mail.service';
import { UserService } from './../user/user.service';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private jwtService: JwtService,private readonly mailSerVice:MailService) { }
  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByUserName(userName);
    if(!user)return null;

    const passwordValid = await bcrypt.compare(password, user.password)
    if (user && passwordValid) {
        return user;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.userName};
    return {
        access_token: this.jwtService.sign(payload),
    };
}
async forgotPass (data:ForgotPasswordDto){
  return this.mailSerVice.sendEmaiForResetPassword(data);
}
async resetPass(newPass:string,token:string){
  const data = await this.jwtService.verify(token);
  const checkUser = await this.usersService.findUser({email:data.email,userName:data.userName});
  if(checkUser.length === 0){
    throw new BadRequestException();
  }
return this.usersService.updateUser({password:newPass},checkUser[0]._id);
}
}
