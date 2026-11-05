import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Unique product title', example: 'Apple iPhone 15 Pro 256GB', minLength: 3 })
  @IsString({ message: 'The title must be string' })
  @MinLength(3, { message: 'The Product title must be at least 3 characters' })
  @IsDefined()
  title!: string;
  //* ---------------------------------------------------------

  //* description:
  @ApiProperty({ description: 'Product description', example: 'Titanium design, A17 Pro chip, 48MP main camera and USB-C.', minLength: 20 })
  @IsString({ message: 'The description must be string' })
  @MinLength(20, {
    message: 'The Product description must be at least 20 characters',
  })
  @IsDefined()
  description!: string;
  //* ---------------------------------------------------------

  //* quantity:
  @ApiProperty({ description: 'Quantity in stock', example: 50, minimum: 1, maximum: 500, default: 1 })
  @IsInt({ message: 'The quantity must be Integer number' })
  @Min(1, { message: 'The Product quantity must be at least 1 product' })
  @Max(500, { message: 'The Product quantity must be at most 500 product' })
  @IsDefined()
  quantity: number = 1;
  //* ---------------------------------------------------------

  //* imageCover:
  @ApiProperty({ description: 'URL of the cover image', example: 'https://example.com/images/iphone-15-cover.jpg', format: 'uri' })
  @IsString({ message: 'The imageCover must be string' })
  @IsUrl({}, { message: 'The Image cover must be valid url' })
  @IsDefined()
  imageCover!: string;
  //* ---------------------------------------------------------

  //* images:
  @ApiPropertyOptional({ description: 'Additional image URLs (the schema marks images as required, so omitting it may fail with a database validation error)', type: [String], example: ['https://example.com/images/iphone-15-1.jpg', 'https://example.com/images/iphone-15-2.jpg'] })
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  @IsOptional()
  images!: string[];
  //* ---------------------------------------------------------

  //* sold:
  @ApiPropertyOptional({ description: 'Number of units already sold', example: 0, default: 0 })
  @IsInt({ message: 'The sold must be Integer number' })
  @IsOptional()
  sold: number = 0;
  //* ---------------------------------------------------------

  //* price:
  @ApiProperty({ description: 'Price in USD', example: 999.99, minimum: 1, maximum: 20000 })
  @IsNumber({}, { message: 'The sold must be number' })
  @Min(1, { message: 'The Product price must be at least 1$' })
  @Max(20000, { message: 'The Product price must be at most 20000$' })
  @IsDefined()
  price!: number;
  //* ---------------------------------------------------------

  //* priceAfterDiscount:
  @ApiPropertyOptional({ description: 'Price after discount in USD', example: 899.99, minimum: 1, maximum: 20000 })
  @IsNumber({}, { message: 'The sold must be number' })
  @Min(1, { message: 'The Product price discount must be at least 1$' })
  @Max(20000, { message: 'The Product price discount must be at most 20000$' })
  @IsOptional()
  priceAfterDiscount!: number;
  //* ---------------------------------------------------------

  //* colors:
  @ApiPropertyOptional({ description: 'Available colors', type: [String], example: ['black', 'silver'] })
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsOptional()
  colors!: string[];
  //* ---------------------------------------------------------

  //* category:
  @ApiProperty({ description: 'Category ObjectId (must exist, otherwise 404)', example: '6a8b2469abf9629023788337' })
  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'The category must be valid id' })
  @IsDefined()
  category!: string;
  //* ---------------------------------------------------------

  //* subCategory:
  @ApiPropertyOptional({ description: 'SubCategory ObjectId (must exist and belong to the given category, otherwise 404)', example: '6a8b2469abf9629023788338' })
  @IsString({ message: 'subCategory must be a string' })
  @IsMongoId({ message: 'The subCategory must be valid id' })
  @IsOptional()
  subCategory!: string;
  //* ---------------------------------------------------------

  //* brand:
  @ApiPropertyOptional({ description: 'Brand ObjectId (must exist, otherwise 404)', example: '6a8b2469abf9629023788339' })
  @IsString({ message: 'brand must be a string' })
  @IsMongoId({ message: 'The brand must be valid id' })
  @IsOptional()
  brand!: string;
  //* ---------------------------------------------------------

  //* rateingAverage:
  @ApiPropertyOptional({ description: 'Average rating (normally maintained by the review module)', example: 0, default: 0 })
  @IsNumber({}, { message: 'rating average must be a number' })
  @IsOptional()
  rateingAverage: number = 0;
  //* ---------------------------------------------------------

  //* rateingCount:
  @ApiPropertyOptional({ description: 'Number of ratings (normally maintained by the review module)', example: 0, default: 0 })
  @IsInt({ message: 'rating average must be an Integer number' })
  @IsOptional()
  rateingCount: number = 0;
  //* ---------------------------------------------------------
}
