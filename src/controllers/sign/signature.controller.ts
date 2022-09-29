import { Signature } from './../../model/dto/signature.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { END_POINT, VERSION } from '../../constants/route';
import { BaseController } from '../base.controller';
import { SignatureService } from '@/service/sign/signature.service';
import { FormDataRequest } from 'nestjs-form-data';

@Controller(`${VERSION.V1}/${END_POINT.SIGNATURE}`)
export class SignatureController extends BaseController {
  constructor(private readonly signatureService: SignatureService) {
    super();
  }
  @Post('')
  @FormDataRequest()
  async createSignature(@Body() signature: Signature) {
    const res = await this.signatureService.createSignature(signature);
    return res;
  }

  @Get()
  async getAll(){
    return await this.signatureService.getAllSignature()
  }
}
