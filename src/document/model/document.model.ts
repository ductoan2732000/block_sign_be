import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentType = DocumentModel & Document
@Schema({ timestamps: true })
export class DocumentModel {
  @Prop({ type: 'string', required: true })
  name: string;

  @Prop({ type: 'string', required: true })
  objectOriginalId: string;

  @Prop({ type: 'string', required: true })
  objectSignedId: string;

  @Prop({
    type: 'string',
    enum:["Completed","Draft","Void","In-Progress"],
    default:"Draft"
  })
  status: string;

  @Prop({type:"string"})
  userId:string
}
export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);
