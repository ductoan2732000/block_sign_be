export class UserSignDto {
  width: number;
  height: number;
  x: number;
  y: number;
  signature: Express.Multer.File;
  number_page: number;
  priority: number;
  type: string;
}
export class FileSignDto {
  signs: UserSignDto[];
}

export interface FileSignUploadDto {
  x: number;
  y: number;
  width: number;
  height: number;
  number_page: number;
  url: string;
  size: number;
  name: string;
  full_path: string;
  user_id: string;
  sha256_original_file: string;
  priority: number;
  type: string;
}
