import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentCreateDto, DocumentUpdateDto } from './dto/document.dto';
import { DocumentModel, DocumentType } from './model/document.model';

@Injectable()
export class DocumentService {
  constructor(@InjectModel(DocumentModel.name) private documentModel : Model<DocumentType>){}
  async createDocument(data:DocumentCreateDto){
    const newDocument = await new this.documentModel(data).save();
    if(!newDocument)throw new BadRequestException();
    return newDocument;
  }
  async updateDocument (dataUpdate:DocumentUpdateDto,idUserUpdate:string,idDocument:string){
   const documentCheck = await this.documentModel.findOne({_id:idDocument});
   if(!documentCheck){
    throw new BadRequestException();
   }
   const {userId} = documentCheck;
   if(userId !== idUserUpdate){
    throw new BadRequestException("Not permission");
   }
   const updateDocument = await this.documentModel.findOneAndUpdate({_id:idDocument},dataUpdate,{new:true});
   return updateDocument;
  }
  async getDocumentById(id:string){
    const documentDetail = await this.documentModel.findOne({_id:id});
    if(!documentDetail){
      throw new BadRequestException("document does not exist")
    }
    return documentDetail;
  }
  async getDocumentByStatus(status:string){
    const listDocumentByStatus = await this.documentModel.find({status});
    if(!listDocumentByStatus){
      throw new BadRequestException("document does not exist")
    }
    return listDocumentByStatus;
  }
  async countDocumentByStatus(){
    const listDocument = await this.documentModel.find({});
    const response = {}
    if(!listDocument){
      throw new BadRequestException();
    }
    ["Completed","Draft","Void","In-Progress"].forEach(item => {
      const count = listDocument.filter(doc => doc.status === item).length;
      response[item] = count;
    })
    return response;
  }
  
}
