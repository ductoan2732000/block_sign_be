import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { FileSign } from 'src/type/dto/sign.dto';
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
  sign(@Body() signs): string {
    return this.signService.postSign(signs);
  }
}
