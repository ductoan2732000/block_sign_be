import { Controller } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

@Controller()
export class BaseController {
  constructor() {
  }
}
