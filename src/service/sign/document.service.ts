var crypto = require('crypto');
import { Injectable } from '@nestjs/common';
import { END_POINT_STORE } from '@/constants/endPoint';
import { BaseService } from '../base.service';

import * as store from 'firebase/storage';
import { PostDocument } from '@/model/dto/document.dto';
@Injectable()
export class DocumentService extends BaseService {
  constructor() {
    super();
  }
  postDocument = async (value: PostDocument) => {
    let res: string = '';
    const newUuid = crypto.randomUUID();
    const arrayBufferFile = value.document.buffer;
    const fileName = (value.document as any).originalName;

    const path = END_POINT_STORE.ORIGINAL_FILE.replace(
      '{{uuid}}',
      newUuid,
    ).replace('{{fileName}}', fileName);
    const storageRef = store.ref(this.store, path);
    const snapshot: store.UploadResult = await store.uploadBytes(
      storageRef,
      arrayBufferFile,
    );
    res = snapshot.metadata.fullPath;

    return res;
  };
}
