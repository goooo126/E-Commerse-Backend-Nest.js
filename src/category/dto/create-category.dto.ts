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
  @IsString({ message: 'The Category name must be string' })
  @MinLength(3, { message: 'The Min Length for category name is 3 characters' })
  @MaxLength(30, {
    message: 'The Max length for category name is 30 characters',
  })
  name!: string;
  //* ----------------------------------------------------

  //* image
  @IsString({ message: 'The Image must be string' })
  @IsUrl({}, { message: 'The image Url must be vaild url' })
  @IsOptional()
  image!: string;
  //* ----------------------------------------------------
}
