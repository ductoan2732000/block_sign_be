import { END_POINT_STORE } from '@/constants/endPoint';
import { getURLDownload, uploadFileToStorage } from '@/constants/utils/storage';
import { BaseService } from '@/service/base.service';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sha256 } from 'js-sha256';
import { Model } from 'mongoose';
import { DocumentCreateDto, DocumentUpdateDto } from './dto/document.dto';
import { DocumentModel, DocumentType } from './model/document.model';

@Injectable()
export class DocumentService extends BaseService {
  constructor(
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentType>,
  ) {
    super();
  }
  async createDocument(value: DocumentCreateDto) {
    // upload file into storage
    const responseUpload = await uploadFileToStorage(
      value.file.buffer,
      (value.file as any).originalName,
      END_POINT_STORE.ORIGINAL_FILE,
      this.store,
    );
    const url = await getURLDownload(this.store, responseUpload.full_path);
    // upload into database
    const data = {
      name: responseUpload.name,
      size: responseUpload.size,
      full_path: responseUpload.full_path,
      url: url,
      is_original: true,
      sha256_original_file: sha256(value.file.buffer),
      status: 'In-Progress',
      userId: '634b6088000ed4aacb3db026',
    };
    const newDocument = await new this.documentModel(data).save();
    if (!newDocument) throw new BadRequestException();
    return newDocument;
  }
  async updateDocument(
    dataUpdate: DocumentUpdateDto,
    idUserUpdate: string,
    idDocument: string,
  ) {
    const documentCheck = await this.documentModel.findOne({ _id: idDocument });
    if (!documentCheck) {
      throw new BadRequestException();
    }
    const { userId } = documentCheck;
    if (userId !== idUserUpdate) {
      throw new BadRequestException('Not permission');
    }
    const updateDocument = await this.documentModel.findOneAndUpdate(
      { _id: idDocument },
      dataUpdate,
      { new: true },
    );
    return updateDocument;
  }
  async getDocumentById(id: string) {
    const documentDetail = await this.documentModel.findOne({ _id: id });
    if (!documentDetail) {
      throw new BadRequestException('document does not exist');
    }
    return documentDetail;
  }
  async getDocumentByStatus(status: string) {
    const listDocumentByStatus = await this.documentModel.find({ status });
    if (!listDocumentByStatus) {
      throw new BadRequestException('document does not exist');
    }
    return listDocumentByStatus;
  }
  async countDocumentByStatus() {
    const listDocument = await this.documentModel.find({});
    const response = {};
    if (!listDocument) {
      throw new BadRequestException();
    }
    ['Completed', 'Draft', 'Void', 'In-Progress'].forEach((item) => {
      const count = listDocument.filter((doc) => doc.status === item).length;
      response[item] = count;
    });
    return response;
  }
}
