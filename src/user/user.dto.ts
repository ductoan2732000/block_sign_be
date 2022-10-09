export class UserRegisterDto{
  userName:string;
  password:string;
  email:string;
  displayName:string;
}

export class UserUpdateDto{
  userName?:string;
  password?:string;
  email?:string;
  displayName?:string;
}
