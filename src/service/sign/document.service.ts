import { Injectable } from '@nestjs/common';
import { END_POINT_DATABASE, END_POINT_STORE } from '@/constants/endPoint';
import { BaseService } from '../base.service';
import { PostDocument } from '@/model/dto/document.dto';
import { getURLDownload, uploadFileToStorage } from '@/constants/utils/storage';
import {
  DocumentAfterSignUpload,
  DocumentUpload,
} from '@/model/interface/realtimeDatabase.interface';
import { sha256 } from 'js-sha256';
import { postToDatabase, readFromDatabase } from '@/constants/utils/database';
import { getFileNameFromDirectoryPath } from '@/constants/utils';
import { PATH_FILE_CONTRACT } from '@/constants/pathContract';
import { SmartContract } from '@/constants/utils/contract';
@Injectable()
export class DocumentService extends BaseService {
  constructor() {
    super();
  }
  getInfor = async (value: PostDocument) => {
    // get data from db
    const sha256File = sha256(value.document.buffer);
    const pathDocument = END_POINT_DATABASE.SIGNED_FILE.replace(
      '{{sha256}}',
      sha256File,
    );
    const data: DocumentAfterSignUpload = await readFromDatabase(
      this.db,
      pathDocument,
    );
    if (data) {
      // create smart contract from address of smart contract
      const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
      const smartContract = new SmartContract(
        PATH_FILE_CONTRACT.SIGN,
        name.fullFileName,
        name.fileName,
        '0x8561c06F03817Ee3cbA4DCE4b850E0A2Dc233860',
      );
      await smartContract.createInput();
      await smartContract.compileContract();
      await smartContract.getContractFromAddress(data.contract_address);

      // get creator create smart contract
      const creatorAddress = await smartContract.getCreatorAddress();
      //get validate from smart contract
      const validate = await smartContract.checkDocument(
        sha256File,
        data.sha256_original_file,
      );
      return {
        ...data,
        creator_address: creatorAddress,
        is_signed: validate,
      };
    }
    return '';
  };
  postDocument = async (value: PostDocument) => {
    // upload file into storage
    const responseUpload = await uploadFileToStorage(
      value.document.buffer,
      (value.document as any).originalName,
      END_POINT_STORE.ORIGINAL_FILE,
      this.store,
    );
    const url = await getURLDownload(this.store, responseUpload.full_path);
    const fileUpload: DocumentUpload = {
      ...responseUpload,
      url: url,
    };

    // upload into database
    const sha256File = sha256(value.document.buffer);
    const pathToDatabase = END_POINT_DATABASE.ORIGINAL_FILE.replace(
      '{{sha256}}',
      sha256File,
    );
    postToDatabase(pathToDatabase, this.db, fileUpload);

    return fileUpload;
  };
}
