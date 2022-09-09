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
import { FileSign } from '@/model/dto/sign.dto';
import {
  getURLDownload,
  uploadMultipleFileToStorage,
} from '@/constants/utils/storage';
import {
  FileSignUpload,
} from '@/model/interface/realtimeDatabase.interface';
import { postToDatabase } from '@/constants/utils/database';
import { sha256 } from 'js-sha256';
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
  postSign = async (sha256File: string, value: FileSign) => {
    /**
     * 1. upload all file sign to firebase store
     * 2. create a smart contract with uuid of file original + list file signed => hash sha256 => save to smart contract
     * 3. get link file signed => with data param => push to firebase realtime database
     */
    const listFile = value.signs.map((item) => item.signature);
    const listFileName: string[] = value.signs.map(
      (item) => (item.signature as any).originalName,
    );
    const listPath = listFileName.map((item) =>
      END_POINT_STORE.SIGN_FILE.replace('{{sha256}}', sha256File).replace(
        '{{fileName}}',
        item,
      ),
    );
    const resUpload = await uploadMultipleFileToStorage(
      listFile,
      listPath,
      this.store,
    );
    const listFullPath: string[] = resUpload.map((item) => item.full_path);
    const urls = await getURLDownload(this.store, listFullPath);

    const listFileUpload: FileSignUpload[] = resUpload.map((item, index) => {
      return {
        ...item,
        url: urls[index],
        width: value.signs[index].width,
        height: value.signs[index].height,
        x: value.signs[index].x,
        y: value.signs[index].y,
        number_page: value.signs[index].number_page,
      };
    });
    // TODO
    // const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
    // const input = createInput(PATH_FILE_CONTRACT.SIGN, name.fullFileName);
    // const resCompile = compileContract(input, name.fullFileName, name.fileName);
    // const res: any = await createContract(resCompile);
    const listSha256 = listFile.map((item) => sha256(item.buffer));
    const pathToDatabase = listSha256.map((item) => {
      return END_POINT_DATABASE.SIGN_FILE.replace(
        '{{sha256_original}}',
        sha256File,
      ).replace('{{sha256_file}}', item);
    });

    postToDatabase(pathToDatabase, this.db, listFileUpload);

    return listFileUpload;
  };
}
