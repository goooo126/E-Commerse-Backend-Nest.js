import {
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  //* Title:
  @IsString({ message: 'The title must be string' })
  @MinLength(3, { message: 'The Product title must be at least 3 characters' })
  @IsDefined()
  title!: string;
  //* ---------------------------------------------------------

  //* description:
  @IsString({ message: 'The description must be string' })
  @MinLength(20, {
    message: 'The Product description must be at least 20 characters',
  })
  @IsDefined()
  description!: string;
  //* ---------------------------------------------------------

  //* quantity:
  @IsInt({ message: 'The quantity must be Integer number' })
  @Min(1, { message: 'The Product quantity must be at least 1 product' })
  @Max(500, { message: 'The Product quantity must be at most 500 product' })
  @IsDefined()
  quantity: number = 1;
  //* ---------------------------------------------------------

  //* imageCover:
  @IsString({ message: 'The imageCover must be string' })
  @IsUrl({}, { message: 'The Image cover must be valid url' })
  @IsDefined()
  imageCover!: string;
  //* ---------------------------------------------------------

  //* images:
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  @IsOptional()
  images!: string[];
  //* ---------------------------------------------------------

  //* sold:
  @IsInt({ message: 'The sold must be Integer number' })
  @IsOptional()
  sold: number = 0;
  //* ---------------------------------------------------------

  //* price:
  @IsNumber({}, { message: 'The sold must be number' })
  @Min(1, { message: 'The Product price must be at least 1$' })
  @Max(20000, { message: 'The Product price must be at most 20000$' })
  @IsDefined()
  price!: number;
  //* ---------------------------------------------------------

  //* priceAfterDiscount:
  @IsNumber({}, { message: 'The sold must be number' })
  @Min(1, { message: 'The Product price discount must be at least 1$' })
  @Max(20000, { message: 'The Product price discount must be at most 20000$' })
  @IsOptional()
  priceAfterDiscount!: number;
  //* ---------------------------------------------------------

  //* colors:
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsOptional()
  colors!: string[];
  //* ---------------------------------------------------------

  //* category:
  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'The category must be valid id' })
  @IsDefined()
  category!: string;
  //* ---------------------------------------------------------

  //* subCategory:
  @IsString({ message: 'subCategory must be a string' })
  @IsMongoId({ message: 'The subCategory must be valid id' })
  @IsOptional()
  subCategory!: string;
  //* ---------------------------------------------------------

  //* brand:
  @IsString({ message: 'brand must be a string' })
  @IsMongoId({ message: 'The brand must be valid id' })
  @IsOptional()
  brand!: string;
  //* ---------------------------------------------------------

  //* rateingAverage:
  @IsNumber({}, { message: 'rating average must be a number' })
  @IsOptional()
  rateingAverage: number = 0;
  //* ---------------------------------------------------------

  //* rateingCount:
  @IsInt({ message: 'rating average must be an Integer number' })
  @IsOptional()
  rateingCount: number = 0;
  //* ---------------------------------------------------------
}
