import { ResponseUpload } from './storage.interface';

export interface DocumentUpload extends ResponseUpload {
  url: string;
}
export interface FileSignUpload extends DocumentUpload {
  width: number;
  height: number;
  x: number;
  y: number;
  number_page: number;
}
