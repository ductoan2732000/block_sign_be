export class DocumentCreateDto{
  name: string;
  objectOriginalId: string;
  objectSignedId: string
  status: string;
  userId:string
}
export class DocumentUpdateDto{
  name?: string;
  objectOriginalId?: string;
  objectSignedId?: string
  status?: string;
  userId?:string
}