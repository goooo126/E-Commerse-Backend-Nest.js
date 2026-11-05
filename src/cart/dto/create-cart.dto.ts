import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Id of the product to add',
    example: '6a8b2469abf9629023788337',
  })
  @IsDefined({
    message: 'The product id is required',
  })
  @IsMongoId({
    message: 'The product id must be a valid MongoDB ObjectId',
  })
  product!: string;

  //* Quantity
  @ApiPropertyOptional({
    description: 'Quantity to add',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt({
    message: 'The quantity must be an integer number',
  })
  @Min(1, {
    message: 'The quantity must be 1 or larger',
  })
  quantity: number =1;

  //* Color
  @ApiPropertyOptional({
    description: 'Selected color of the product',
    example: 'black',
    default: '',
  })
  @IsOptional()
  @IsString({
    message: 'The color must be a string',
  })
  color: string='';
}
