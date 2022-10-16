import { AuthService } from './../auth/auth.service';
import { Controller,Post,Get,Put ,Body,Request,Query} from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentCreateDto, DocumentUpdateDto } from './dto/document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService:DocumentService,private authService:AuthService){}
  @Post("create")
  createDocument(@Body() data:DocumentCreateDto){
    return this.documentService.createDocument(data)
  }
  @Put("update")
  async updateDocument(@Request()req ,@Body()dataUpdate:DocumentUpdateDto,@Query("id") idDocument:string){
    const tokenBear = req.headers.authorization;
    const decodedToken =await this.authService.validateToken(tokenBear);
    return this.documentService.updateDocument(dataUpdate,decodedToken?.id,idDocument);
  }
  @Get()
  async getDetailDocument(@Query("id") id:string){
   return this.documentService.getDocumentById(id);
  }
  @Get("get-by-status")
  async getDocumentByStatus(@Query("status") status:string){
    return this.documentService.getDocumentByStatus(status);
  }
  @Get("count-document-by-status")
  async countDocumentByStatus(){
    return this.documentService.countDocumentByStatus();
  }
}
