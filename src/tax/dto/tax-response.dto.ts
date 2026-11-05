import { ApiProperty } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

export class TaxResponseDto extends BaseDocumentDto {
  @ApiProperty({
    description:
      'Tax name. The order flow looks up the entries named "productTax" and "shippingTax"',
    example: 'productTax',
  })
  name!: string;

  @ApiProperty({
    description:
      'Fixed tax amount (>= 0). The order service adds the "productTax" and "shippingTax" prices to the order total',
    example: 15,
    minimum: 0,
  })
  price!: number;
}
