import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDoucment = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  //* cartItems:
  @Prop({
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: Product.name,
          require: true,
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
    required: true,
  })
  cartItems!: { product: string; quantity: number; color: string }[];
  //* ================================================================

  //* TotalPrice:
  @Prop({
    type: Number,
  })
  totalPrice!: number;
  //* ================================================================

  //* totalPriceAfterDiscount:
  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount!: number;
  //* ================================================================

  //* coupons:
  @Prop({
    type: [
      {
        name: {
          type: String,
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: Coupon.name,
        },
      },
    ],
  })
  coupons!: {
    name: string;
    id: string;
  }[];
  //* ================================================================

  //* user:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: string;
  //* ================================================================
}

export const CartSchema = SchemaFactory.createForClass(Cart);
