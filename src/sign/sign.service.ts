import { END_POINT_STORE } from '@/constants/endPoint';
import {
  getURLDownload,
  uploadFileToStorage,
  uploadMultipleFileToStorage,
} from '@/constants/utils/storage';
import { BaseService } from '@/service/base.service';
import {
  Injectable,
  BadRequestException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sha256 } from 'js-sha256';
import { Model } from 'mongoose';
import { FileSignDto, FileSignUploadDto } from './dto/sign.dto';
import { SignModel, SignType } from './model/sign.model';
import { DocumentService } from '@/document/document.service';
import { attachFileSignToDocument } from '@/constants/utils';
@Injectable()
export class SignService extends BaseService {
  constructor(
    @InjectModel(SignModel.name) private signModel: Model<SignType>,
    private readonly documentService: DocumentService,
  ) {
    super();
  }
  async postSign(sha256File: string, value: FileSignDto, idUser: string) {
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
    // upload list file signs to storage
    const resUpload = await uploadMultipleFileToStorage(
      listFile,
      listPath,
      this.store,
    );
    const listFullPath: string[] = resUpload.map((item) => item.full_path);
    const urls = await getURLDownload(this.store, listFullPath);
    const listFileUpload: FileSignUploadDto[] = resUpload.map((item, index) => {
      return {
        size: item.size,
        name: item.name,
        full_path: item.full_path,
        url: urls[index],
        width: value.signs[index].width,
        height: value.signs[index].height,
        x: value.signs[index].x,
        y: value.signs[index].y,
        number_page: value.signs[index].number_page,
        user_id: idUser,
        sha256_original_file: sha256File,
        priority: value.signs[index].priority,
        type: value.signs[index].type,
      };
    });
    // upload into db mongoose
    listFileUpload.forEach(async (item) => {
      const newSigns = await new this.signModel(item).save();
      if (!newSigns) throw new BadRequestException();
    });

    // get file original from sha256 file
    const fileExist = await this.documentService.getDocumentByOriginalSha256(
      sha256File,
    );
    if (!fileExist) {
      throw new ConflictException('File not found');
    }

    // handle sign file
    const fileAfterSign = await attachFileSignToDocument(
      fileExist.url,
      value.signs,
    );
    // upload file after signed to storage firebase
    const pathDocumentAfterSign = END_POINT_STORE.SIGN_DOCUMENT.replace(
      '{{sha256}}',
      sha256File,
    );
    const responseUploadSigned = await uploadFileToStorage(
      fileAfterSign,
      `[after sign] ${fileExist.name}`,
      pathDocumentAfterSign,
      this.store,
    );
    const responseDocumentPath: string = responseUploadSigned.full_path;
    const urlResponseDocument = await getURLDownload(
      this.store,
      responseDocumentPath,
    );
    const documentToUpload = {
      name: responseUploadSigned.name,
      size: responseUploadSigned.size,
      full_path: responseUploadSigned.full_path,
      url: urlResponseDocument,
      is_original: false,
      sha256_original_file: sha256File,
      sha256_file: sha256(fileAfterSign),
      smart_contract_address: '',
      status: 'Completed',
      user_id: idUser,
    };
    // upload file signed to db mongoose
    const response =
      this.documentService.createDocumentSigned(documentToUpload);
    return response;
  }
}
