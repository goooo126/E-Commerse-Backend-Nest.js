import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { timestamp } from 'rxjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name Must at least 3 characters'],
    max: [30, 'Name Must at least 30 characters'],
  })
  name!: string;
  @Prop({ type: String, required: true, unique: true })
  email!: string;
  @Prop({
    type: String,
    required: true,
    min: [3, 'Password Must at least 3 characters'],
    max: [20, 'Password Must at least 20 characters'],
  })
  password!: string;
  @Prop({
    type: String,
    required: true,
    enum: ['user', 'admin'],
  })
  role!: string;

  @Prop({
    type: String,
  })
  avatar!: string;

  @Prop({
    type: Number,
  })
  age!: number;

  @Prop({
    type: String,
  })
  phoneNumber!: string;

  @Prop({
    type: String,
  })
  address!: string;

  @Prop({
    type: Boolean,
    enum: [false, true],
  })
  active!: boolean;

  @Prop({
    type: String,
  })
  verificationCode!: string;

  @Prop({
    type: String,
    enum:['male','female']
  })
  gender!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
