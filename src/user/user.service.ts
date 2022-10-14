import { User, UserDocument } from '@/user/model/user.model';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserRegisterDto, UserUpdateDto } from './user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async registerUser(dataUser: UserRegisterDto) {
    const userExist = await this.UserModel.findOne({
      userName: dataUser.userName,
    });
    if (userExist) {
      throw new ConflictException('Username already exists');
    }
    dataUser.password = await bcrypt.hash(dataUser.password, 10);
    const newUser = new this.UserModel(dataUser);
    const {password,...userData} =JSON.parse(JSON.stringify( await newUser.save()))
    return userData;
  }
  async getUserById(id: string) {
    const {password,...findUser} = await this.UserModel.findOne({ _id: id }).lean();
    if (!findUser) {
      throw new BadRequestException("This user doesn't exist");
    }
    return findUser;
  }
  async updateUser(dataUpdate: UserUpdateDto, id: string) {
    const userCheck = await this.UserModel.find({
      userName: dataUpdate.userName,
      _id: { $ne: id },
    });
    if (userCheck.length > 0) {
      throw new ConflictException('Username already exists');
    }
    if (dataUpdate.password) {
      dataUpdate.password = await bcrypt.hash(dataUpdate.password, 10);
    }
    const userUpdate = await this.UserModel.findOneAndUpdate(
      { _id: id },
      dataUpdate,
      { new: true },
    ).lean();
    if (!userUpdate) throw new BadRequestException();
    const { password, ...data } = userUpdate;
    return data;
  }
  async getUser() {
    const user = this.UserModel.find({ userName: { $ne: 'thanh' } });
    return user;
  }

  async getUserByUserName(userName:string)
  {
    return this.UserModel.findOne({userName}).lean();
  }
  async findUser(options={}){
    return this.UserModel.find(options)
  }
}
