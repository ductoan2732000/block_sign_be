import { Signature } from './../../model/dto/signature.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { END_POINT, VERSION } from '../../constants/route';
import { BaseController } from '../base.controller';
import { SignatureService } from '@/service/sign/signature.service';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from '@/auth/auth.service';

@Controller(`${VERSION.V1}/${END_POINT.SIGNATURE}`)
export class SignatureController extends BaseController {
  constructor(
    private readonly signatureService: SignatureService,
    private authService: AuthService,
  ) {
    super();
  }
  @Post('')
  @FormDataRequest()
  async createSignature(@Request() req, @Body() signature: Signature) {
    const tokenBear = req.headers.authorization;
    const decodedToken = await this.authService.validateToken(tokenBear);
    const res = await this.signatureService.createSignature(
      signature,
      decodedToken.id,
    );
    return res;
  }

  @Get()
  async getAll(@Request() req) {
    const tokenBear = req.headers.authorization;
    const decodedToken = await this.authService.validateToken(tokenBear);
    return await this.signatureService.getAllSignature(decodedToken.id);
  }

  @Delete(':id')
  async deleteSignature(@Param('id') id: string) {
    return await this.signatureService.deleteSignature(id);
  }
}
