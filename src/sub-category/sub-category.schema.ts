import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { timestamp } from 'rxjs';
import { Category } from 'src/category/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name Must at least 3 characters'],
    max: [30, 'Name Must at least 30 characters'],
  })
  name!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category!: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
