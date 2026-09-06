import {
  IsDefined,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  //* Name:
  @IsString({ message: 'The supplier name must be string' })
  @MinLength(3, { message: 'The supplier name must be at least 3 characters' })
  @MaxLength(100, {
    message: 'The supplier name must be at least 100 characters',
  })
  name!: string;
  //* --------------------------------------------

  //* Website:
  @IsString({ message: 'The supplier website must be string' })
  @IsUrl({}, { message: 'The Supplier website must be url' })
  @IsDefined()
  website!: string;
  //* --------------------------------------------
}
