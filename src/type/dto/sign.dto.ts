import { IsNotEmpty } from "class-validator";

export class UserSign {
  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;

  @IsNotEmpty()
  signature: File;

  @IsNotEmpty()
  numberPage: number;
}
export class FileSign {
  @IsNotEmpty()
  signs: UserSign[];
}
