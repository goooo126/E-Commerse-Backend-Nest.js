import { IsDefined, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
    //* Name
    @IsString({message:"The Name must be string"})
    @MinLength(3,{message:"The Name must at least 3 characters"})
    @MaxLength(100,{message:"The Name must at most 100 charaters"})
    @IsDefined()
    name!:string;
    //* -------------------------------------------------

    //* Email
    @IsUrl({},{message:"The Name must be valid Url"})
    @IsOptional()
    email!:string;
    //* -------------------------------------------------
}
