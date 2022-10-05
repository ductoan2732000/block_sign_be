import { getDatabase, ref, onValue, get, remove} from "firebase/database";
import { Signature } from './../../model/dto/signature.dto';
import { Injectable } from '@nestjs/common';
import { END_POINT_DATABASE, END_POINT_STORE } from '@/constants/endPoint';
import { BaseService } from '../base.service';
import {
  getURLDownload,
  uploadFileToStorage,
  generateUUID
} from '@/constants/utils/storage';
import {
  DocumentUpload,
} from '@/model/interface/realtimeDatabase.interface';
import { postToDatabase } from '@/constants/utils/database';
import { sha256 } from 'js-sha256';
@Injectable()
export class SignatureService extends BaseService {
  constructor() {
    super();
  }
  
  createSignature = async (signature: Signature) => {
    // upload file into storage
    const responseUpload = await uploadFileToStorage(
      signature.signature.buffer,
      (signature.signature as any).originalName,
      END_POINT_STORE.SIGNATURE,
      this.store,
    );
    const url = await getURLDownload(this.store, responseUpload.full_path);
    const fileUpload: DocumentUpload = {
      ...responseUpload,
      url: url,
    };

    // upload into database
    const sha256File = generateUUID();
    const pathToDatabase = END_POINT_DATABASE.SIGNATURE.replace(
      '{{sha256}}',
      sha256File,
    );
    postToDatabase(pathToDatabase, this.db, fileUpload);

    return fileUpload;
  };

  async getAllSignature(){
    const db = getDatabase();
    const signatures = ref(db, 'signature');
    const snapshot = await get(signatures);
    return snapshot.val();
  }

  async deleteSignature(id: string){
    const db = getDatabase();
    const signatures = ref(db, `signature/${id}`);
    const snapshot = await remove(signatures);
    return true;
  }
}
