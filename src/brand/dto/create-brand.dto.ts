import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
    //* Name
    @ApiProperty({
        description: "Brand name (must be unique)",
        example: "Samsung",
        minLength: 3,
        maxLength: 100,
    })
    @IsString({message:"The Name must be string"})
    @MinLength(3,{message:"The Name must at least 3 characters"})
    @MaxLength(100,{message:"The Name must at most 100 charaters"})
    @IsDefined()
    name!:string;
    //* -------------------------------------------------

    //* Email
    @ApiPropertyOptional({
        description:
            "Despite its name, must be a valid URL (it is stored in the brand `image` field)",
        example: "https://example.com/images/samsung.png",
        format: "uri",
    })
    @IsUrl({},{message:"The Name must be valid Url"})
    @IsOptional()
    email!:string;
    //* -------------------------------------------------
}
