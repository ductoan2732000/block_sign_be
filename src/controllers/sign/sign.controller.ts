import { FileSign } from '~/model/dto/sign.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { END_POINT, VERSION } from '../../constants/route';
import { SignService } from '../../service/sign/sign.service';

@Controller(`${VERSION.V1}/${END_POINT.SIGN}`)
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Get()
  getSign(): string {
    return this.signService.getSign();
  }
  @Post()
  @ApiBody({ description: 'body:any someMethod' })
  @FormDataRequest()
  async sign(@Body() signs: FileSign) {
    const res = await this.signService.postSign(signs);
    return res;
  }
}
