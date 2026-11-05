import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class GetProductsDto {
  @ApiPropertyOptional({ description: 'Accepted by the DTO but currently ignored by the service', example: 'iphone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by title (case-insensitive partial match)', example: 'iphone' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Filter by category ObjectId', example: '6a8b2469abf9629023788337' })
  @IsOptional()
  @IsMongoId()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by subCategory ObjectId', example: '6a8b2469abf9629023788338' })
  @IsOptional()
  @IsMongoId()
  subCategory?: string;

  @ApiPropertyOptional({ description: 'Filter by brand ObjectId (exact match; any string passes validation)', example: '6a8b2469abf9629023788339' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Minimum price (inclusive)', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price (inclusive)', example: 2000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Accepted by the DTO but currently ignored by the service', example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ description: 'Accepted by the DTO but currently ignored by the service. Send "true" or "false"', type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  inStock?: boolean;

  @ApiPropertyOptional({ description: 'Accepted by the DTO but currently ignored by the service. Send "true" or "false"', type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page size (service default 10)', type: Number, default: 10, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Number of documents to skip (service default 0)', type: Number, default: 0, example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional({ description: 'Product field to sort by (any string is accepted and used as the Mongo sort key, e.g. createdAt, price, title, rateingAverage, sold)', default: 'createdAt', example: 'price' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ description: 'Sort direction; any value other than "asc" sorts descending', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}