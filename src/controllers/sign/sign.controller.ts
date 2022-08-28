import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
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
  sign(@Body() createCatDto: any): any {
    return JSON.stringify(createCatDto);
  }
}
