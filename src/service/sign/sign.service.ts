import { Injectable } from '@nestjs/common';
import { END_POINT_DATABASE, END_POINT_STORE } from '@/constants/endPoint';
import { PATH_FILE_CONTRACT } from '@/constants/pathContract';
import { BaseService } from '../base.service';
import {
  attachFileSignToDocument,
  getFileNameFromDirectoryPath,
} from '@/constants/utils';
import {
  compileContract,
  createContract,
  createInput,
} from '@/constants/utils/contract';
import { FileSign } from '@/model/dto/sign.dto';
import {
  getURLDownload,
  uploadFileToStorage,
  uploadMultipleFileToStorage,
} from '@/constants/utils/storage';
import {
  DocumentAfterSignUpload,
  DocumentUpload,
  FileSignUpload,
  ResponseSign,
} from '@/model/interface/realtimeDatabase.interface';
import { postToDatabase, readFromDatabase } from '@/constants/utils/database';
import { sha256 } from 'js-sha256';
@Injectable()
export class SignService extends BaseService {
  constructor() {
    super();
  }
  getSign = async (): Promise<any> => {
    const pathDocument = END_POINT_DATABASE.ORIGINAL_FILE.replace(
      '{{sha256}}',
      '26a39b94e930fa238dc108dcfde09d96b029c25d84b3cf77701a73f3630d0375',
    );
    const res = await readFromDatabase(this.db, pathDocument);
    return res;
  };
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

    // upload file signed to store
    const pathDocument = END_POINT_DATABASE.ORIGINAL_FILE.replace(
      '{{sha256}}',
      sha256File,
    );
    const originalFile: DocumentUpload = await readFromDatabase(
      this.db,
      pathDocument,
    );
    const fileAfterSign = await attachFileSignToDocument(
      originalFile.url,
      value.signs,
    );
    const pathDocumentAfterSign = END_POINT_STORE.SIGN_DOCUMENT.replace(
      '{{sha256}}',
      sha256File,
    );

    const responseUploadSigned = await uploadFileToStorage(
      fileAfterSign,
      `[after sign] ${originalFile.name}`,
      pathDocumentAfterSign,
      this.store,
    );
    const responseDocumentPath: string = responseUploadSigned.full_path;
    const urlResponseDocument = await getURLDownload(
      this.store,
      responseDocumentPath,
    );
    const documentUpload: DocumentAfterSignUpload = {
      ...responseUploadSigned,
      url: urlResponseDocument,
      sha256_original_file: sha256File,
    };

    // TODO
    // const name = getFileNameFromDirectoryPath(PATH_FILE_CONTRACT.SIGN);
    // const input = createInput(PATH_FILE_CONTRACT.SIGN, name.fullFileName);
    // const resCompile = compileContract(input, name.fullFileName, name.fileName);
    // const res: any = await createContract(resCompile);
    // save to database
    const listSha256 = listFile.map((item) => sha256(item.buffer));
    const pathToDatabase = listSha256.map((item) => {
      return END_POINT_DATABASE.SIGN_FILE.replace(
        '{{sha256_original}}',
        sha256File,
      ).replace('{{sha256_file}}', item);
    });
    const pathResToDatabase = END_POINT_DATABASE.SIGNED_FILE.replace(
      '{{sha256}}',
      sha256(fileAfterSign),
    );
    postToDatabase(pathToDatabase, this.db, listFileUpload);
    postToDatabase(pathResToDatabase, this.db, documentUpload);
    const res: ResponseSign = {
      signs: listFileUpload,
      document: documentUpload,
    };
    return res;
  };
}
