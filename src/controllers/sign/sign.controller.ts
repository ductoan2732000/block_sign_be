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

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

import * as path from 'path';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB-O6mBSFHUW4YuonzR-5bTs2PTKHLqlVc',
  authDomain: 'block-sign-be.firebaseapp.com',
  databaseURL:
    'https://block-sign-be-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'block-sign-be',
  storageBucket: 'block-sign-be.appspot.com',
  messagingSenderId: '300592399740',
  appId: '1:300592399740:web:68f659aabc72150a43d0f9',
  measurementId: 'G-42SN3DNZQH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const reference = ref(db, 'test/2');
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
    const aa = process.env.FIREBASE_MEASUREMENT_ID;
    console.log(aa);
    set(reference, { name: 'be toan', age: 22 });
  }
}
