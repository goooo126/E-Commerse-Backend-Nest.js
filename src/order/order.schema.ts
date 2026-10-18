import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  //* User:
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user!: string;
  //* ==========================================================

  //* cartItems:
  @Prop({
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: Product.name,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
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

  //* TaxPrice:
  @Prop({
    type: Number,
    default: 0,
  })
  taxPrice!: number;
  //* ==========================================================

  //* ShippingPrice:
  @Prop({
    type: Number,
    default: 0,
  })
  shippingPrice!: number;
  //* ==========================================================

  //* TotalOrderPrice:
  @Prop({
    type: Number,
    required: true,
  })
  totalOrderPrice!: number;
  //* ==========================================================

  //* PaymentMethod:
  @Prop({
    type: String,
    default: 'card',
    enum: ['cash', 'card'],
    required: true,
  })
  paymentMethod!: string;
  //* ==========================================================

  //* IsPaid:
  @Prop({
    type: Boolean,
    default: false,
  })
  isPaid!: boolean;
  //* ==========================================================

  //* PaidAt:
  @Prop({
    type: Date,
  })
  paidAt!: Date;
  //* ==========================================================

  //* IsDelivered:
  @Prop({
    type: Boolean,
    default: false,
  })
  isDelivered!: boolean;
  //* ==========================================================

  //* deleviredAt:
  @Prop({
    type: Date,
  })
  deleviredAt!: Date;
  //* ==========================================================

  //* address:
  @Prop({
    type: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    required: true,
  })
  address!: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
  //* ==========================================================

  @Prop({
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'failed'],
  })
  paymentStatus!: string;

  @Prop({
    type: String,
    default: null,
  })
  stripeCheckoutSessionId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
