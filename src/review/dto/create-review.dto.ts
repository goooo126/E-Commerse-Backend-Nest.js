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
  @IsString({ message: 'The Review must be string' })
  @MinLength(3, { message: 'The Review must be aleast 3 characters' })
  @IsOptional()
  reviewText!: string;
  //* ===================================

  //* rating:
  @IsInt({ message: 'The Review must be Integer number' })
  @Min(0, { message: 'The Min rating is 0 stars' })
  @Max(5, { message: 'The Max rating is 5 stars' })
  @IsDefined()
  rating!: number;
  //* ===================================

  //* product:
  @IsMongoId({ message: 'The product must be valid id' })
  @IsDefined()
  product!: string;
  //* ===================================
}
