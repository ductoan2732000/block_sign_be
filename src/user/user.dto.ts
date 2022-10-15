export class UserRegisterDto{
  userName:string;
  password:string;
  email:string;
  displayName:string;
  refreshToken?:string;
}

export class UserUpdateDto{
  userName?:string;
  password?:string;
  email?:string;
  displayName?:string;
  refreshToken?:string;
}
export class UserLoginDto{
  userName:string;
  password:string;
}
