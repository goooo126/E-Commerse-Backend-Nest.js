import {
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubCategoryDto {
  //* Name
  @IsString({ message: 'The Category name must be string' })
  @MinLength(3, { message: 'The Min Length for category name is 3 characters' })
  @MaxLength(30, {
    message: 'The Max length for category name is 30 characters',
  })
  name!: string;
  //* ----------------------------------------------------

  //* category
  @IsString({ message: 'The category must be string' })
  @IsDefined()
  category!: string;
  //* ----------------------------------------------------
}

