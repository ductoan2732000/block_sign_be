import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserRegisterDto } from './user.dto';
import { UserService } from './user.service';
@Controller("user")
export class UserController{
  constructor(private readonly userService:UserService){}
  @Post("register")
  registerUser(@Body() userData:UserRegisterDto){
    return this.userService.registerUser(userData);
  }
  @Get()
  getUserbyId(@Query("id") id:string){
    return this.userService.getUserById(id);
  }
  @Put()
  updateUser(@Query("id") id,@Body() dataUpdate:UserRegisterDto){
   return this.userService.updateUser(dataUpdate,id);
  }
}