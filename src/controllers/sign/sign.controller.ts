import { FileSign } from '~/model/dto/sign.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':sha256')
  async getInfor(@Param('sha256') sha256File: string) {
    const res: any = await this.signService.getSign(sha256File);
    return res;
  }

  @Post(':sha256')
  @ApiBody({ description: 'body:any someMethod' })
  @FormDataRequest()
  async sign(@Param('sha256') sha256File: string, @Body() signs: FileSign) {
    const res = await this.signService.postSign(sha256File, signs);
    return res;
  }
}
