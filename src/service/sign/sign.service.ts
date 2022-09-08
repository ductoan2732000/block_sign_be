import { Injectable } from '@nestjs/common';
import { END_POINT_DATABASE, END_POINT_STORE } from '@/constants/endPoint';
import { PATH_FILE_CONTRACT } from '@/constants/pathContract';
import { BaseService } from '../base.service';
import { getFileNameFromDirectoryPath } from '@/constants/utils';
import {
  compileContract,
  createContract,
  createInput,
} from '@/constants/utils/contract';
import * as store from 'firebase/storage';
import * as database from 'firebase/database';
import { FileSign } from '@/model/dto/sign.dto';
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
  postSign = async (uuid: string, value: FileSign) => {
    /**
     * 1. upload all file sign to firebase store
     * 2. get link file signed => with data param => push to firebase realtime database
     * 3. create a smart contract with uuid of file original + list file signed => hash sha256 => save to smart contract
     */
    let res = [];
    const listFile = value.signs.map((item) => item.signature.buffer);
    const listFileName: string[] = value.signs.map(
      (item) => (item.signature as any).originalName,
    );
    const listPath = listFileName.map((item) =>
      END_POINT_STORE.SIGN_FILE.replace('{{uuid}}', uuid).replace(
        '{{fileName}}',
        item,
      ),
    );
    const listStoreRef: store.StorageReference[] = listPath.map((item) =>
      store.ref(this.store, item),
    );
    const listPromise = [];
    listFile.forEach((item, index) => {
      listPromise.push(store.uploadBytes(listStoreRef[index], item));
    });
    await Promise.all(listPromise).then((values: store.UploadResult[]) => {
      res = values.map((item) => item.metadata.fullPath);
    });

    // TODO
    // const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
    // const input = createInput(PATH_FILE_CONTRACT.SIGN, name.fullFileName);
    // const resCompile = compileContract(input, name.fullFileName, name.fileName);
    // const res: any = await createContract(resCompile);

    // const reference = database.ref(this.db, END_POINT_DATABASE.TEST);
    // database.set(reference, { name: res, age: 12 });

    return res;
  };
}
