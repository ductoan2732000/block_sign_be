import { UserController } from "@/user/user.controller";
import { User, UserSchema } from "@/model/user.model";
import { UserService } from "@/user/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
  providers:[UserService],
  controllers:[UserController],
  exports:[UserService]
})
export class UserModule{}