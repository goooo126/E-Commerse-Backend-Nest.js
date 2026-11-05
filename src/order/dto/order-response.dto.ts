import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BaseDocumentDto,
  EXAMPLE_OBJECT_ID,
} from 'src/common/swagger/swagger.helpers';

export class OrderItemResponseDto {
  @ApiProperty({ description: 'Product id (ObjectId)', example: EXAMPLE_OBJECT_ID })
  product!: string;

  @ApiProperty({ description: 'Ordered quantity', example: 2, minimum: 1 })
  quantity!: number;

  @ApiProperty({ description: 'Selected color (empty string when none)', example: 'black' })
  color!: string;
}

export class OrderAddressResponseDto {
  @ApiProperty({ description: 'Address label', example: 'Home' })
  alias!: string;

  @ApiProperty({ description: 'Address details', example: 'Fayoum, Egypt' })
  details!: string;

  @ApiProperty({ description: 'Contact phone number', example: '01000000000' })
  phone!: string;

  @ApiProperty({ description: 'City', example: 'Fayoum' })
  city!: string;

  @ApiProperty({ description: 'Postal code', example: '63511' })
  postalCode!: string;
}

export class OrderResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Id of the user who owns the order', example: EXAMPLE_OBJECT_ID })
  user!: string;

  @ApiProperty({ type: () => [OrderItemResponseDto], description: 'Snapshot of the cart items at order time' })
  cartItems!: OrderItemResponseDto[];

  @ApiProperty({ description: 'Tax price (from the `productTax` configuration)', example: 50, default: 0 })
  taxPrice!: number;

  @ApiProperty({ description: 'Shipping price (from the `shippingTax` configuration)', example: 30, default: 0 })
  shippingPrice!: number;

  @ApiProperty({
    description: 'cart.totalPriceAfterDiscount + taxPrice + shippingPrice (EGP)',
    example: 1205,
  })
  totalOrderPrice!: number;

  @ApiProperty({ enum: ['cash', 'card'], default: 'card', example: 'card' })
  paymentMethod!: string;

  @ApiProperty({ description: 'Whether the order has been paid', example: false, default: false })
  isPaid!: boolean;

  @ApiPropertyOptional({
    description: 'When the order was paid (set by the Stripe webhook)',
    type: String,
    format: 'date-time',
    example: '2026-11-03T10:20:00.000Z',
  })
  paidAt?: Date;

  @ApiProperty({ description: 'Whether the order has been delivered', example: false, default: false })
  isDelivered!: boolean;

  @ApiPropertyOptional({
    description: 'When the order was delivered (property name is spelled "deleviredAt" in the schema)',
    type: String,
    format: 'date-time',
    example: '2026-11-05T12:00:00.000Z',
  })
  deleviredAt?: Date;

  @ApiProperty({ type: () => OrderAddressResponseDto, description: 'Shipping address' })
  address!: OrderAddressResponseDto;

  @ApiProperty({ enum: ['pending', 'paid', 'failed'], default: 'pending', example: 'pending' })
  paymentStatus!: string;

  @ApiPropertyOptional({
    description: 'Stripe Checkout Session id (card payments only)',
    example: 'cs_test_a1B2c3D4e5F6g7H8i9J0',
    nullable: true,
  })
  stripeCheckoutSessionId?: string | null;
}

export class CheckoutSessionResponseDto {
  @ApiProperty({ description: 'Id of the newly created (pending) order', example: EXAMPLE_OBJECT_ID })
  orderId!: string;

  @ApiProperty({ description: 'Payment status of the order', example: 'pending', enum: ['pending', 'paid', 'failed'] })
  paymentStatus!: string;

  @ApiProperty({
    description: 'Stripe Checkout URL: the client must redirect the user here to pay',
    example: 'https://checkout.stripe.com/c/pay/cs_test_a1B2c3D4e5F6g7H8i9J0',
  })
  checkoutUrl!: string;

  @ApiProperty({ description: 'Stripe Checkout Session id', example: 'cs_test_a1B2c3D4e5F6g7H8i9J0' })
  sessionId!: string;
}
