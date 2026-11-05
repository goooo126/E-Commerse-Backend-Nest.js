import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDefined, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCouponDto {
    //* Name:
    @ApiProperty({ description: "Unique coupon name / code", example: "SUMMER2027", minLength: 3, maxLength: 100 })
    @IsString({message:"the name of coupon must be string"})
    @MinLength(3,{message:"The Coupon must at least 3 characters"})
    @MaxLength(100,{message:"The Coupon must at most 100 characters"})
    name!:string;
    //*-----------------------------------------------

    //* expireDate:
    @ApiProperty({ description: "Expiration date (ISO 8601). Must be in the future, otherwise the request fails with 400 'Coupon has expired'", example: "2027-12-31T23:59:59.000Z", type: String, format: "date-time" })
    @IsDate({message:"exipreDate must be valid date"})
    @IsDefined()
    @Type(() => Date)
    expireDate!:Date;
    //*-----------------------------------------------


    //* discount:
    @ApiProperty({ description: "Discount percentage", example: 15, minimum: 0, maximum: 90 })
    @IsNumber({},{message:"The discount must be number"})
    @Min(0,{message:"Discount must be 0 or larger"})
    @Max(90,{message:"Discoun must be 90 or lower"})
    @IsDefined()
    discount!:number;
    //*-----------------------------------------------

    
}
