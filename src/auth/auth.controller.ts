import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto, UserRegisterDto } from './../user/user.dto';
import { UserService } from './../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() dataLogin: UserLoginDto) {
    return this.authService.login(dataLogin);
  }
  @Post('register')
  register(@Body() data: UserRegisterDto) {
    return this.userService.registerUser(data);
  }
  @Post('forgot-password')
  forgotPass(@Body() bodyForgotpass: ForgotPasswordDto) {
    return this.authService.forgotPass(bodyForgotpass);
  }
  @Post('reset-password')
  resetPass(@Body('newPassword') newpass, @Body('token') token: string) {
    return this.authService.resetPass(newpass, token);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
