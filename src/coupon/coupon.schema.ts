import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    min: [3, 'The Coupon must at least 3 characters'],
    max: [100, 'The Coupon must at most 100 characters'],
  })
  name!: string;

  @Prop({
    type: Date,
    required: true,
  })
  expireDate!: Date;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 90,
  })
  discount!: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
