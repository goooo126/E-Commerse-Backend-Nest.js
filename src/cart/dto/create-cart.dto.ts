import {
  IsDefined,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCartDto {
  //* Product
  @IsDefined({
    message: 'The product id is required',
  })
  @IsMongoId({
    message: 'The product id must be a valid MongoDB ObjectId',
  })
  product!: string;

  //* Quantity
  @IsOptional()
  @IsInt({
    message: 'The quantity must be an integer number',
  })
  @Min(1, {
    message: 'The quantity must be 1 or larger',
  })
  quantity: number =1;

  //* Color
  @IsOptional()
  @IsString({
    message: 'The color must be a string',
  })
  color: string='';
}
