import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  //* Title:
  @Prop({
    type: String,
    required: true,
    minlength: 3,
  })
  title!: string;
  //* ===============================================

  //* description:
  @Prop({
    type: String,
    required: true,
    minlength: 20,
  })
  description!: string;
  //* ===============================================

  //* quantity:
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 500,
    default: 1,
  })
  quantity!: number;
  //* ===============================================

  //* imageCover:
  @Prop({
    type: String,
    required: true,
  })
  imageCover!: string;
  //* ===============================================

  //* images:
  @Prop({
    type: [String],
    required: true,
  })
  images!: string[];
  //* ===============================================

  //* sold:
  @Prop({
    type: Number,
    default: 0,
  })
  sold!: number;
  //* ===============================================

  //* price:
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 20000,
  })
  price!: number;
  //* ===============================================

  //* priceAfterDiscount:
  @Prop({
    type: Number,
    min: 1,
    max: 20000,
  })
  priceAfterDiscount!: number;
  //* ===============================================

  //* colors:
  @Prop({
    type: [String],
  })
  colors!: string[];
  //* ===============================================

  //* category:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category!: string;
  //* ===============================================

  //* subCategory:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory!: string;
  //* ===============================================

  //* brand:
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Brand.name,
  })
  brand!: string;
  //* ===============================================

  //* rateingAverage:
  @Prop({
    type: Number,
    default: 0,
  })
  rateingAverage!: number;
  //* ===============================================

  //* rateingCount:
  @Prop({
    type: Number,
    default: 0,
  })
  rateingCount!: number;
  //* ===============================================
}

export const ProductSchema = SchemaFactory.createForClass(Product);
