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
