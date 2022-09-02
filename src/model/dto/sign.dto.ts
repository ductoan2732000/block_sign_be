import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

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
  signature: Express.Multer.File;

  @IsNotEmpty()
  numberPage: number;
}
export class FileSign {
  @ValidateNested({ each: true })
  @Type(() => UserSign)
  @IsNotEmpty()
  signs: UserSign[];
}
