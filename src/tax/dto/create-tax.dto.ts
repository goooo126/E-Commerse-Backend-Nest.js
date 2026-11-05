import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTaxDto {
  //* Name:
  @ApiProperty({
    description:
      'Tax name (must be unique). The order flow reads "productTax" and "shippingTax"',
    example: 'productTax',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'The Name of Tax must be string' })
  @IsDefined()
  @MinLength(3, { message: 'The Tax Name must be at least 3 characters' })
  @MaxLength(50, { message: 'The Tax Name must be at most 50 characters' })
  name!: string;
  //* -----------------------------------------------

  //* Prive:
  @ApiProperty({
    description: 'Fixed tax amount, greater than or equal to 0',
    example: 15,
    minimum: 0,
  })
  @IsNumber({}, { message: 'The Name of Tax must be string' })
  @IsDefined()
  @Min(0, { message: 'The Tax Price must be greater or equal to zero' })
  @Type(() => Number)
  price!: number;
  //* -----------------------------------------------
}
