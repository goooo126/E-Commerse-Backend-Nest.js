import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type RviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  //* reviewText:
  @Prop({
    type: String,
    minLength: 3,
  })
  reviewText!: string;
  //* ===================================

  //* rating:
  @Prop({
    type: Number,
    min: 0,
    max: 5,
    required: true,
  })
  rating!: number;
  //* ===================================

  //* user:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: string;
  //* ===================================

  //* product:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product!: string;
  //* ===================================
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
