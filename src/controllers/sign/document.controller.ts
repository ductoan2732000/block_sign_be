import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { END_POINT, VERSION } from '../../constants/route';
import { DocumentService } from '../../service/sign/document.service';
import { BaseController } from '../base.controller';
import { PostDocument } from '@/model/dto/document.dto';

@Controller(`${VERSION.V1}/${END_POINT.DOCUMENT}`)
export class DocumentController extends BaseController {
  constructor(private readonly documentService: DocumentService) {
    super();
  }

  @Post('info')
  @FormDataRequest()
  async getInforDocument(@Body() document: PostDocument) {
    const res = await this.documentService.getInfor(document);
    return res;
  }

  @Post()
  @ApiBody({ description: 'body:any someMethod' })
  @FormDataRequest()
  async postDocument(@Body() document: PostDocument) {
    const res = await this.documentService.postDocument(document);
    return res;
  }
}
