import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCouponDto {
    //* Name:
    @IsString({message:"the name of coupon must be string"})
    @MinLength(3,{message:"The Coupon must at least 3 characters"})
    @MaxLength(100,{message:"The Coupon must at most 100 characters"})
    name!:string;
    //*-----------------------------------------------

    //* expireDate:
    @IsDate({message:"exipreDate must be valid date"})
    @IsDefined()
    @Type(() => Date)
    expireDate!:Date;
    //*-----------------------------------------------


    //* discount:
    @IsNumber({},{message:"The discount must be number"})
    @Min(0,{message:"Discount must be 0 or larger"})
    @Max(90,{message:"Discoun must be 90 or lower"})
    @IsDefined()
    discount!:number;
    //*-----------------------------------------------

    
}
