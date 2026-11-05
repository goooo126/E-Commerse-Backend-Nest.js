import { ApiProperty } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

export class CouponResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Unique coupon name / code', example: 'SUMMER2027' })
  name!: string;

  @ApiProperty({
    description: 'Expiration date',
    example: '2027-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  expireDate!: Date;

  @ApiProperty({ description: 'Discount percentage (0-90)', example: 15, minimum: 0, maximum: 90 })
  discount!: number;
}
