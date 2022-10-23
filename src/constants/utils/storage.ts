import { sha256 } from 'js-sha256';
import * as store from 'firebase/storage';
import { ResponseUpload } from '@/model/interface/storage.interface';
export const uploadFileToStorage = async (
  file: any,
  nameFile: string,
  pathInStore: string,
  storeFirebase: store.FirebaseStorage,
): Promise<ResponseUpload | any> => {
  const arrayBufferFile = file;
  const sha256File = sha256(arrayBufferFile);
  const path = pathInStore
    .replace('{{sha256}}', sha256File)
    .replace('{{fileName}}', nameFile);
  const storageRef = store.ref(storeFirebase, path);
  try {
    const snapshot: store.UploadResult = await store.uploadBytes(
      storageRef,
      arrayBufferFile,
    );
    const res: ResponseUpload = {
      full_path: snapshot.metadata.fullPath,
      name: snapshot.metadata.name,
      size: snapshot.metadata.size,
      created_at: snapshot.metadata.timeCreated,
      updated_at: snapshot.metadata.updated,
    };
    return res;
  } catch (error) {
    return error;
  }
};

export const generateUUID = () => {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};
export const uploadMultipleFileToStorage = async (
  listFile: Express.Multer.File[],
  listPath: string[],
  storeFirebase: store.FirebaseStorage,
): Promise<ResponseUpload[] | any> => {
  const listArrayBuffer = listFile.map((item) => item.buffer);
  const listStoreRef: store.StorageReference[] = listPath.map((item) =>
    store.ref(storeFirebase, item),
  );
  const listPromise = [];
  listArrayBuffer.forEach((item, index) => {
    listPromise.push(store.uploadBytes(listStoreRef[index], item));
  });
  try {
    const values: store.UploadResult[] = await Promise.all(listPromise);
    const res: ResponseUpload[] = values.map((item) => {
      return {
        full_path: item.metadata.fullPath,
        name: item.metadata.name,
        size: item.metadata.size,
        created_at: item.metadata.timeCreated,
        updated_at: item.metadata.updated,
      };
    });
    return res;
  } catch (error) {
    return error;
  }
};
export const getURLDownload = async (
  storeFirebase: store.FirebaseStorage,
  path: string | string[],
): Promise<string | string[] | any> => {
  try {
    if (typeof path === 'string') {
      const url = await store.getDownloadURL(store.ref(storeFirebase, path));
      return url;
    } else {
      const listPromise = path.map((item) =>
        store.getDownloadURL(store.ref(storeFirebase, item)),
      );
      const res = await Promise.all(listPromise);
      return res;
    }
  } catch (error) {
    return error;
  }
};
