import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import { Body, Controller, Post ,UseGuards,Request, Get} from '@nestjs/common';
import { JwtService ,} from '@nestjs/jwt';
import { UserRegisterDto } from './../user/user.dto';
import { UserService } from './../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService:JwtService,private readonly userService:UserService,private authService: AuthService){
  }
  @UseGuards(AuthGuard('local'))
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
}
  @Post("register")
  register(@Body() data : UserRegisterDto){
    return this.userService.registerUser(data)
  }
  @Post("forgot-password")
  forgotPass(@Body() bodyForgotpass : ForgotPasswordDto){
    return this.authService.forgotPass(bodyForgotpass)
  }
  @Post("reset-password")
  resetPass(@Body("newPassword") newpass,@Body("token") token:string){
    return this.authService.resetPass(newpass,token);
  }
  
}
