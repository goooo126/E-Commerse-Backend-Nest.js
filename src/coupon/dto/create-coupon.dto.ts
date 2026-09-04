import { IsDate, IsDefined, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateCouponDto {
    //* Name:
    @IsString({message:"the name of coupon must be string"})
    @MinLength(3,{message:"The Coupon must at least 3 characters"})
    @MaxLength(100,{message:"The Coupon must at most 100 characters"})
    name!:string;
    //*-----------------------------------------------

    //* exipreDate:
    @IsDate({message:"exipreDate must be valid date"})
    @IsDefined()
    exipreDate!:Date;
    //*-----------------------------------------------


    //* discount:
    @IsNumber({},{message:"The discount must be number"})
    @Min(0,{message:"Discount must be 0 or larger"})
    @IsDefined()
    discount!:number;
    //*-----------------------------------------------

    
}
