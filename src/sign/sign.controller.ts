import { AuthService } from './../auth/auth.service';
import { DocumentService } from '@/document/document.service';
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { SignService } from './sign.service';
// import { DocumentCreateDto, DocumentUpdateDto } from './dto/document.dto';
import { BaseController } from '@/controllers/base.controller';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { ApiBody } from '@nestjs/swagger';
import { FileSignDto } from './dto/sign.dto';

@Controller('sign')
export class SignController extends BaseController {
  constructor(
    private readonly signService: SignService,
    private authService: AuthService,
  ) {
    super();
  }
  @Post(':sha256')
  @ApiBody({ description: 'body:any someMethod' })
  @FormDataRequest()
  async sign(@Param('sha256') sha256File: string, @Body() signs: FileSignDto) {
    const res = await this.signService.postSign(sha256File, signs);
    return res;
  }
}
