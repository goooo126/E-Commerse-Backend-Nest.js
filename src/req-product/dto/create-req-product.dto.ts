import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateReqProductDto {
  //* titleName:
  @ApiProperty({ description: 'Name of the requested product (a user cannot request the same name twice)', example: 'Sony WH-1000XM5 headphones', minLength: 5 })
  @IsString({ message: 'The title name must be string' })
  @MinLength(5, { message: 'The title name must at least 5 characters' })
  @IsDefined()
  titleName!: string;
  //* -------------------------------------------------------

  //* details:
  @ApiProperty({ description: 'Details about the requested product', example: 'Black color, with the original carrying case.', minLength: 5 })
  @IsString({ message: 'The details must be string' })
  @MinLength(5, { message: 'The details must at least 5 characters' })
  @IsDefined()
  details!: string;
  //* -------------------------------------------------------

  //* quantity:
  @ApiProperty({ description: 'Requested quantity (integer)', example: 2, minimum: 1 })
  @IsInt({ message: 'The quantity must be Integer Number' })
  @Min(1, { message: 'The quantity must at least 1 product' })
  @IsDefined()
  quantity!: number;
  //* -------------------------------------------------------

  //* category:
  @ApiPropertyOptional({ description: 'Free-text category (not an ObjectId)', example: 'Electronics' })
  @IsString({ message: 'The category must be string' })
  @IsOptional()
  category!: string;
  //* -------------------------------------------------------
}
