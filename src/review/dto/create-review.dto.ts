import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  //* reviewText:
  @ApiPropertyOptional({ description: 'Review text', example: 'Great phone, battery lasts all day.', minLength: 3 })
  @IsString({ message: 'The Review must be string' })
  @MinLength(3, { message: 'The Review must be aleast 3 characters' })
  @IsOptional()
  reviewText!: string;
  //* ===================================

  //* rating:
  @ApiProperty({ description: 'Rating in stars (integer)', example: 5, minimum: 0, maximum: 5 })
  @IsInt({ message: 'The Review must be Integer number' })
  @Min(0, { message: 'The Min rating is 0 stars' })
  @Max(5, { message: 'The Max rating is 5 stars' })
  @IsDefined()
  rating!: number;
  //* ===================================

  //* product:
  @ApiProperty({ description: 'ObjectId of the product being reviewed', example: '6a8b2469abf9629023788337' })
  @IsMongoId({ message: 'The product must be valid id' })
  @IsDefined()
  product!: string;
  //* ===================================
}
