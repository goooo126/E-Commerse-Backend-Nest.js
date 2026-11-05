import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  BaseDocumentDto,
  EXAMPLE_OBJECT_ID,
} from 'src/common/swagger/swagger.helpers';

export class CartItemResponseDto {
  @ApiProperty({
    description:
      'Product id (ObjectId). Populated as { _id, title, imageCover, price } only by GET /cart/{id} (admin)',
    example: EXAMPLE_OBJECT_ID,
  })
  product!: string;

  @ApiProperty({ description: 'Quantity of this product in the cart', example: 2, minimum: 1 })
  quantity!: number;

  @ApiProperty({ description: 'Selected color (empty string when none)', example: 'black' })
  color!: string;
}

export class CartCouponResponseDto {
  @ApiProperty({ description: 'Coupon name', example: 'SUMMER25' })
  name!: string;

  @ApiProperty({ description: 'Coupon id (ObjectId)', example: EXAMPLE_OBJECT_ID })
  id!: string;
}

export class CartUserSummaryDto {
  @ApiProperty({ description: 'User id', example: EXAMPLE_OBJECT_ID })
  _id!: string;

  @ApiProperty({ description: 'User name', example: 'Ahmed Ali' })
  name!: string;

  @ApiPropertyOptional({
    description: 'User email (populated in the admin list GET /cart only)',
    example: 'ahmed@example.com',
  })
  email?: string;
}

@ApiExtraModels(CartUserSummaryDto)
export class CartResponseDto extends BaseDocumentDto {
  @ApiProperty({ type: () => [CartItemResponseDto], description: 'Products in the cart' })
  cartItems!: CartItemResponseDto[];

  @ApiProperty({ description: 'Sum of price * quantity of all items', example: 1500 })
  totalPrice!: number;

  @ApiProperty({
    description: 'Total after the applied coupon discount (equals totalPrice when no coupon)',
    example: 1125,
  })
  totalPriceAfterDiscount!: number;

  @ApiProperty({
    type: () => [CartCouponResponseDto],
    description: 'Applied coupons (at most one)',
  })
  coupons!: CartCouponResponseDto[];

  @ApiProperty({
    description:
      'Owner of the cart: an ObjectId string, or a populated { _id, name[, email] } object in admin endpoints',
    oneOf: [{ type: 'string', example: EXAMPLE_OBJECT_ID }, { $ref: getSchemaPath(CartUserSummaryDto) }],
  })
  user!: string | CartUserSummaryDto;
}
