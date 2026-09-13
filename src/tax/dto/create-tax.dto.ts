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
  @IsString({ message: 'The Name of Tax must be string' })
  @IsDefined()
  @MinLength(3, { message: 'The Tax Name must be at least 3 characters' })
  @MaxLength(50, { message: 'The Tax Name must be at most 50 characters' })
  name!: string;
  //* -----------------------------------------------

  //* Prive:
  @IsNumber({}, { message: 'The Name of Tax must be string' })
  @IsDefined()
  @Min(0, { message: 'The Tax Price must be greater or equal to zero' })
  @Type(() => Number)
  price!: number;
  //* -----------------------------------------------
}
