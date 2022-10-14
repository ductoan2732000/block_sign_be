import { BadRequestException, Injectable,HttpException } from '@nestjs/common';
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
    const userByName= await this.usersService.getUserByUserName(user.userName)
    if(!userByName)throw new BadRequestException("Not find user");
    const {password,...dataUser} = userByName;
    const payload = { username: user.userName,id:dataUser._id};
    return {
        token: this.jwtService.sign(payload),
        user:dataUser
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
 async validateToken(bearToken: string): Promise<any>  {
  if(bearToken.indexOf("Bearer") >=0){
    const arrayToken = bearToken.split(" ");
    if(arrayToken.length !==2){
      throw new BadRequestException("invalid token");
    }
    bearToken = arrayToken[1];
  }
  try {
      const verifiedToken = await this.jwtService.verify(bearToken);
      return verifiedToken;
  } catch (error) {
         throw new BadRequestException(error.message);
  }
}  
}
