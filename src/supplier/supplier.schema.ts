import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({timestamps:true})
export class Supplier{

    //* Name
    @Prop({
        type:String,
        required:true,
        min:[3,'The supplier name must be at least 3 characters'],
        max:[100,'The supplier name must be at least 100 characters'],
    })
    name!:string;
    //* --------------------------------------------

    //* Website
    @Prop({
        type:String,
        required:true,
    })
    website!:string;
    //* --------------------------------------------
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);