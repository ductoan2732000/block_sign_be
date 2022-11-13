export class DocumentCreateDto {
  file: Express.Multer.File;
}
export class DocumentUpdateDto {
  name?: string;
  status?: string;
  user_id?: string;
  smart_contract_address?: string;
}
