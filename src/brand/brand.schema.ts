import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    require: true,
    min: [3, 'Name Must at least 3 characters'],
    max: [100, 'Name Must at least 100 characters'],
  })
  name!: string;

  @Prop({
    type:String,
  })
  image!:string;
}


export const BrandSchema = SchemaFactory.createForClass(Brand);
