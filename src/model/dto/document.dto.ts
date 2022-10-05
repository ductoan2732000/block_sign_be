import { IsNotEmpty } from 'class-validator';

export class PostDocument {
  @IsNotEmpty()
  file: Express.Multer.File;
}
