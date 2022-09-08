import { FileSign } from '~/model/dto/sign.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { END_POINT, VERSION } from '../../constants/route';
import { SignService } from '../../service/sign/sign.service';
import { BaseController } from '../base.controller';

@Controller(`${VERSION.V1}/${END_POINT.SIGN}`)
export class SignController extends BaseController {
  constructor(private readonly signService: SignService) {
    super();
  }

  @Get()
  getSign(): any {
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
