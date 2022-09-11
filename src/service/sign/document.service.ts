import { Injectable } from '@nestjs/common';
import { END_POINT_DATABASE, END_POINT_STORE } from '@/constants/endPoint';
import { BaseService } from '../base.service';
import { PostDocument } from '@/model/dto/document.dto';
import { getURLDownload, uploadFileToStorage } from '@/constants/utils/storage';
import { DocumentUpload } from '@/model/interface/realtimeDatabase.interface';
import { sha256 } from 'js-sha256';
import { postToDatabase } from '@/constants/utils/database';
@Injectable()
export class DocumentService extends BaseService {
  constructor() {
    super();
  }
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
