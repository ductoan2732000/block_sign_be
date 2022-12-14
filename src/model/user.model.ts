import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}
export type UserDocument = User & Document
@Schema({ timestamps: true })
export class User {
  @Prop({ type: 'string', required: true, unique: true })
  userName: string;

  @Prop({ type: 'string', required: true })
  password: string;

  @Prop({ type: 'string', required: true })
  displayName: string;

  @Prop({
    type: 'string',
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  })
  email: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
