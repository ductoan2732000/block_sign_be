import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignType = SignModel & Document;
@Schema({ timestamps: true })
export class SignModel {
  @Prop({ type: 'number', required: true })
  x: number;

  @Prop({ type: 'number', required: true })
  y: number;

  @Prop({ type: 'number', required: true })
  width: number;

  @Prop({ type: 'number', required: true })
  height: number;

  @Prop({ type: 'number', required: true })
  number_page: number;

  @Prop({ type: 'string' })
  url: string;

  @Prop({ type: 'number' })
  size: number;

  @Prop({ type: 'string' })
  name: string;

  @Prop({ type: 'string', required: true })
  full_path: string;

  @Prop({ type: 'string' })
  user_id: string;

  @Prop({ type: 'string', required: true })
  sha256_original_file: string;

  @Prop({ type: 'number', required: true })
  priority: number;

  @Prop({
    type: 'string',
    enum: ['Name', 'Text', 'Signature', 'Checkbox', 'Radio', 'Date'],
    required: true,
  })
  type: string;
}
export const SignSchema = SchemaFactory.createForClass(SignModel);
