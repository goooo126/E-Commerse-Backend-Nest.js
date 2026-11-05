import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubCategoryDto {
  //* Name
  @ApiProperty({
    description: 'Sub-category name (must be unique)',
    example: 'iPhones',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'The Category name must be string' })
  @MinLength(3, { message: 'The Min Length for category name is 3 characters' })
  @MaxLength(30, {
    message: 'The Max length for category name is 30 characters',
  })
  name!: string;
  //* ----------------------------------------------------

  //* category
  @ApiProperty({
    description: 'ObjectId of the parent category (must exist)',
    example: '6a8b2469abf9629023788337',
  })
  @IsString({ message: 'The category must be string' })
  @IsDefined()
  category!: string;
  //* ----------------------------------------------------
}

