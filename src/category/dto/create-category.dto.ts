import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  //* Name
  @ApiProperty({
    description: 'Category name (must be unique)',
    example: 'Electronics',
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

  //* image
  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/images/electronics.png',
    format: 'uri',
  })
  @IsString({ message: 'The Image must be string' })
  @IsUrl({}, { message: 'The image Url must be vaild url' })
  @IsOptional()
  image!: string;
  //* ----------------------------------------------------
}
