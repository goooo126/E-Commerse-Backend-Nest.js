import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { timestamp } from 'rxjs';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name Must at least 3 characters'],
    max: [30, 'Name Must at least 30 characters'],
  })
  name!: string;

  @Prop({
    type: String,
  })
  image!: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
