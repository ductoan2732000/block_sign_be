import { PATH_FILE_CONTRACT } from '@/constants/pathContract';
import { getFileNameFromDirectoryPath } from '@/constants/utils';
import { SmartContract } from '@/constants/utils/contract';
import { TypeContract } from '@/model/interface/contract.interface';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';

@Injectable()
export class ContractService extends BaseService {
  constructor() {
    super();
  }
  getContract = async (type: TypeContract) => {
    if (type.toString() === TypeContract.SIGN.toString()) {
      const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
      const smartContract = new SmartContract(
        PATH_FILE_CONTRACT.SIGN,
        name.fullFileName,
        name.fileName,
        '0x8561c06F03817Ee3cbA4DCE4b850E0A2Dc233860',
      );
      await smartContract.createInput();
      await smartContract.compileContract();
      return smartContract.responseCompile;
    }
    return '';
  };
}
