import { FileSign } from '~/model/dto/sign.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';
import { END_POINT, VERSION } from '../../constants/route';
import { ContractService } from '../../service/contract/contract.service';
import { BaseController } from '../base.controller';
import { TypeContract } from '@/model/interface/contract.interface';

@Controller(`${VERSION.V1}/${END_POINT.CONTRACT}`)
export class ContractController extends BaseController {
  constructor(private readonly signService: ContractService) {
    super();
  }

  @Get(':type')
  async getContractCompile(@Param('type') type: TypeContract) {
    const res: any = await this.signService.getContract(type);
    return res;
  }
}
