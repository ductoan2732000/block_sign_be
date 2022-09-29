import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class Signature {
  @IsNotEmpty()
  signature: Express.Multer.File;
}
// export class FileSign {
//   @ValidateNested({ each: true })
//   @Type(() => UserSign)
//   @IsNotEmpty()
//   signs: UserSign[];
// }
