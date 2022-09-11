import { ResponseUpload } from './storage.interface';

export interface DocumentUpload extends ResponseUpload {
  url: string;
}
export interface DocumentAfterSignUpload extends ResponseUpload {
  url: string;
  sha256_original_file: string;
}
export interface FileSignUpload extends DocumentUpload {
  width: number;
  height: number;
  x: number;
  y: number;
  number_page: number;
}
export interface ResponseSign {
  signs: FileSignUpload[];
  document: DocumentAfterSignUpload;
}
