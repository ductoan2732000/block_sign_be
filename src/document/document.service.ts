import { UserService } from '@/user/user.service';
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
    private userService: UserService,
  ) {
    super();
  }
  async createDocument(value: DocumentCreateDto, id: string) {
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
      user_id: id,
    };
    const newDocument = await new this.documentModel(data).save();
    if (!newDocument) throw new BadRequestException();
    return newDocument;
  }
  async createDocumentSigned(value: any) {
    const newDocument = await new this.documentModel(value).save();
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
    const { user_id } = documentCheck;
    if (user_id !== idUserUpdate) {
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
  async getDocumentByStatus(
    status: string,
    page: number,
    limit: number,
    name: string,
  ) {
    let params = {} as any;
    if (status) {
      params.status = status;
    }
    if (name) {
      params.name = name;
    }
    let limitNum = Number(limit);
    let pageNum = Number(page);
    if (!limit || !Number.isInteger(limitNum)) {
      limitNum = 15;
    }
    if (!page || !Number.isInteger(pageNum)) {
      pageNum = 1;
    }
    let listDocumentByStatus = (await this.documentModel
      .find(params)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()) as any;
    const total_item = await this.documentModel.find(params).countDocuments();
    const total_page = Math.ceil(total_item / limitNum);
    if (!listDocumentByStatus) {
      throw new BadRequestException('document does not exist');
    }
    for (let i = 0; i < listDocumentByStatus.length; i++) {
      const { user_id } = listDocumentByStatus[i];
      const { createdAt, updatedAt, refreshToken, ...user } =
        (await this.userService.getUserById(user_id)) as any;
      listDocumentByStatus[i].user = user;
      delete listDocumentByStatus[i].user_id;
    }
    return { data: listDocumentByStatus, total_item, total_page };
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
  async getDocumentByOriginalSha256(sha256File: string) {
    return this.documentModel.findOne({ sha256_original_file: sha256File });
  }
}
