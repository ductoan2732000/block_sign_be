import { Injectable } from '@nestjs/common';
import { ref, set } from 'firebase/database';
import { BaseService } from '../base.service';
import { testSmartContract } from '../smart-contract/test';
@Injectable()
export class SignService extends BaseService {
  constructor() {
    super();
  }
  getSign(): string {
    return JSON.stringify(this.firebaseConfig);
  }
  postSign = async (value: any) => {
    // const test = await testSmartContract();
    const reference = ref(this.db, 'test/3');
    set(reference, { name: 'be hung', age: 12 });
    return value;
  };
}
