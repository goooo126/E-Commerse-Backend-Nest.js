import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class AddressDto {
  @ApiProperty({ description: 'Address label', example: 'Home' })
  @IsString()
  @IsNotEmpty()
  alias!: string;

  @ApiProperty({ description: 'Address details', example: 'Fayoum, Egypt' })
  @IsString()
  @IsNotEmpty()
  details!: string;

  @ApiProperty({ description: 'Contact phone number', example: '01000000000' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ description: 'City', example: 'Fayoum' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ description: 'Postal code', example: '63511' })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}

export class CreateOrderDto {
  //* paymentMethod:
  @ApiPropertyOptional({
    description:
      'Payment method. `card` creates a Stripe Checkout session, `cash` creates the order directly',
    enum: ['card', 'cash'],
    default: 'card',
    example: 'card',
  })
  @IsString({ message: 'The payment method must be string' })
  @IsEnum(['card', 'cash'], {
    message: 'The payment method must be cash or card',
  })
  @IsOptional()
  paymentMethod: string = 'card';
  //* =========================================

  //* address
  @ApiProperty({
    type: () => AddressDto,
    description: 'Shipping address',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
  //* =========================================
}
