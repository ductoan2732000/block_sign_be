import { Module } from '@nestjs/common';
import { SignController } from './controllers/sign/sign.controller';
import { SignService } from './service/sign/sign.service';
@Module({
  imports: [],
  controllers: [SignController],
  providers: [SignService],
})
export class AppModule {}
