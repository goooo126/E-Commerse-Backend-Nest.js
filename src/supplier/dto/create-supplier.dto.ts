import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupplierDto {
  //* Name:
  @ApiProperty({
    description: 'Supplier name (must be unique)',
    example: 'Global Tech Supplies',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'The supplier name must be string' })
  @MinLength(3, { message: 'The supplier name must be at least 3 characters' })
  @MaxLength(100, {
    message: 'The supplier name must be at least 100 characters',
  })
  name!: string;
  //* --------------------------------------------

  //* Website:
  @ApiProperty({
    description: 'Supplier website URL (must be unique on update)',
    example: 'https://globaltech.example.com',
    format: 'uri',
  })
  @IsString({ message: 'The supplier website must be string' })
  @IsUrl({}, { message: 'The Supplier website must be url' })
  @IsDefined()
  website!: string;
  //* --------------------------------------------
}
