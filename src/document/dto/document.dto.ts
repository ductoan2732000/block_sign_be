export class DocumentCreateDto {
  file: Express.Multer.File;
}
export class DocumentUpdateDto {
  name?: string;
  objectOriginalId?: string;
  objectSignedId?: string;
  status?: string;
  userId?: string;
}
