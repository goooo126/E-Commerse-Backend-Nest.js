import { IsDefined, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateReqProductDto {
  //* titleName:
  @IsString({ message: 'The title name must be string' })
  @MinLength(5, { message: 'The title name must at least 5 characters' })
  @IsDefined()
  titleName!: string;
  //* -------------------------------------------------------

  //* details:
  @IsString({ message: 'The details must be string' })
  @MinLength(5, { message: 'The details must at least 5 characters' })
  @IsDefined()
  details!: string;
  //* -------------------------------------------------------

  //* quantity:
  @IsInt({ message: 'The quantity must be Integer Number' })
  @Min(1, { message: 'The quantity must at least 1 product' })
  @IsDefined()
  quantity!: number;
  //* -------------------------------------------------------

  //* category:
  @IsString({ message: 'The category must be string' })
  @IsOptional()
  category!: string;
  //* -------------------------------------------------------
}
