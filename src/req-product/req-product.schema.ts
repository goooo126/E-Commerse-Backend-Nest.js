import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type ReqProductDcoument = HydratedDocument<ReqProduct>;

@Schema({ timestamps: true })
export class ReqProduct {
  //* titleName:
  @Prop({
    type: String,
    required: true,
    min: [5, 'The title name must at least 5 characters'],
  })
  titleName!: string;
  //* ------------------------------------

  //* details:
  @Prop({
    type: String,
    required: true,
    min: [5, 'The details must at least 5 characters'],
  })
  details!: string;
  //* ------------------------------------

  //* quantity:
  @Prop({
    type: Number,
    required: true,
    min: [1, 'The quantity must at least 1 Product'],
  })
  quantity!: number;
  //* ------------------------------------

  //* category:
  @Prop({
    type: String,
  })
  category!: string;
  //* ------------------------------------

  //* user:
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user!: string;
  //* ------------------------------------
}

export const ReqProductSchema = SchemaFactory.createForClass(ReqProduct);
