import { Injectable } from '@nestjs/common';
import { testSmartContract } from '../smart-contract/test';
@Injectable()
export class SignService {
  getSign(): string {
    return 'fdfdfdlf';
  }
  postSign = async (value: any) => {
    const test = await testSmartContract();
    console.log(test);
    return test;
  };
}
