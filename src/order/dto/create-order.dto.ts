import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  //* paymentMethod:
  @IsString({ message: 'The payment method must be string' })
  @IsEnum(['card', 'cash'], {
    message: 'The payment method must be cash or card',
  })
  @IsOptional()
  paymentMethod: string = 'card';
  //* =========================================

  //* address
  //* address
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
  //* =========================================
}

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  alias!: string;

  @IsString()
  @IsNotEmpty()
  details!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}
