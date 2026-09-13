import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaxDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxlength: 50,
  })
  name!: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price!: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);
