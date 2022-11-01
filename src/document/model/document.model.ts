import { User } from '@/user/model/user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentType = DocumentModel & Document;
@Schema({ timestamps: true })
export class DocumentModel {
  @Prop({ type: 'string', required: true })
  name: string;

  @Prop({ type: 'number' })
  size: number;

  @Prop({ type: 'string', required: true })
  full_path: string;

  @Prop({ type: 'string', required: true })
  url: string;

  @Prop({ type: 'string', required: true })
  sha256_original_file: string;

  @Prop({ type: 'string' })
  sha256_file: string;

  @Prop({ type: 'string' })
  contract_address: string;

  @Prop({ type: 'string' })
  transaction_hash: string;

  @Prop({ type: 'boolean', required: true })
  is_original: boolean;

  @Prop({
    type: 'string',
    enum: ['Completed', 'Draft', 'Void', 'In-Progress'],
    default: 'Draft',
  })
  status: string;

  @Prop({ type: 'string'})
  user_id: string;
 
}
export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);
