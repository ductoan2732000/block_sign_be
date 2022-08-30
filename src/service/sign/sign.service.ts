import { Injectable } from '@nestjs/common';

@Injectable()
export class SignService {
  getSign(): string {
    return 'fdfdfdlf';
  }
  postSign(value: any): string {
    return JSON.stringify(value);
  }
}
