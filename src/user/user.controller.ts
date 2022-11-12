import { AuthService } from './../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Post, Put, Query, Request, UseGuards} from "@nestjs/common";
import { UserRegisterDto } from './user.dto';
import { UserService } from './user.service';
@Controller("user")
export class UserController{
  constructor(private readonly userService:UserService,private readonly authService:AuthService){}
  @Post("register")
  registerUser(@Body() userData:UserRegisterDto){
    return this.userService.registerUser(userData);
  }
  @Get("info-user")
 async getInfoUser( @Request() req,){
      const tokenBear = req.headers.authorization;
      const decodedToken = await this.authService.validateToken(tokenBear);  
      const {id} = decodedToken
   return this.userService.getUserById(id);
  }
  @Put("update")
  async updateUser(@Request() req, @Body() dataUpdate:UserRegisterDto){
    const tokenBear = req.headers.authorization;
    const decodedToken = await this.authService.validateToken(tokenBear);  
   return this.userService.updateUser(dataUpdate,decodedToken.id);
  }
  
  
  @Get("test")
  @UseGuards(AuthGuard("jwt"))
  getTest(){
   return "ok";
  }
}