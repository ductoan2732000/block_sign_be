import { authConfig } from '@/config/auth.config';
import {
  BadRequestException,
  Injectable,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { MailService } from './../mail/mail.service';
import { UserService } from './../user/user.service';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
    private readonly mailSerVice: MailService,
  ) {}
  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByUserName(userName);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      return user;
    }
    return null;
  }
  async login(dataLogin: any) {
    const userByName = await this.usersService.getUserByUserName(
      dataLogin.userName,
    );
    if (!userByName) throw new BadRequestException('user does not exist');
    const { password, ...dataUser } = userByName;
    const passwordMatches = await bcrypt.compare(
      dataLogin.password,
      userByName.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(dataUser._id, dataUser.userName);
    await this.updateRefreshToken(dataUser._id, tokens.refreshToken);
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: dataUser,
    };
  }
  async forgotPass(data: ForgotPasswordDto) {
    return this.mailSerVice.sendEmaiForResetPassword(data);
  }
  async resetPass(newPass: string, token: string) {
    const data = await this.jwtService.verify(token);
    const checkUser = await this.usersService.findUser({
      email: data.email,
      userName: data.userName,
    });
    if (checkUser.length === 0) {
      throw new BadRequestException();
    }
    return this.usersService.updateUser(
      { password: newPass },
      checkUser[0]._id,
    );
  }
  async validateToken(bearToken: string): Promise<any> {
    if(!bearToken)throw new BadRequestException('invalid token');
    if (bearToken.indexOf('Bearer') >= 0) {
      const arrayToken = bearToken.split(' ');
      if (arrayToken.length !== 2) {
        throw new BadRequestException('invalid token');
      }
      bearToken = arrayToken[1];
    }
    try {
      const verifiedToken = await this.jwtService.verify(bearToken,{secret:authConfig.secretkey});
      return verifiedToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateUser(
      {
        refreshToken: hashedRefreshToken,
      },
      userId,
    );
  }
  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, username: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        id: userId,
        username,
      },
      {
        secret: authConfig.secretkey,
        expiresIn: authConfig.expiredToken,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        id: userId,
        username,
      },
      {
        secret: authConfig.refreshKey,
        expiresIn: authConfig.expiredRefreshToken,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user._id, user.userName);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }
}
