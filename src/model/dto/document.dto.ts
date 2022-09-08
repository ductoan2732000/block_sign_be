import { IsNotEmpty } from 'class-validator';

export class PostDocument {
  @IsNotEmpty()
  document: Express.Multer.File;
}
