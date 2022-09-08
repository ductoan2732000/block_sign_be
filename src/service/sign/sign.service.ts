import { PATH_FILE_CONTRACT } from '@/constants/pathContract';
import { getFileNameFromDirectoryPath } from '@/constants/utils';
import {
  compileContract,
  createContract,
  createInput,
} from '@/constants/utils/contract';
import { Injectable } from '@nestjs/common';
import { ref, set } from 'firebase/database';
import { BaseService } from '../base.service';
@Injectable()
export class SignService extends BaseService {
  constructor() {
    super();
  }
  getSign(): any {
    const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
    const input = createInput(PATH_FILE_CONTRACT.SIGN, name.fullFileName);
    const resCompile = compileContract(input, name.fullFileName, name.fileName);
    const res = createContract(resCompile);
    return res;
  }
  postSign = async (value: any) => {
    const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
    const input = createInput(PATH_FILE_CONTRACT.SIGN, name.fullFileName);
    const resCompile = compileContract(input, name.fullFileName, name.fileName);
    const res: any = await createContract(resCompile);
    const reference = ref(this.db, 'test/2');
    set(reference, { name: res, age: 12 });
    return res;
  };
}
