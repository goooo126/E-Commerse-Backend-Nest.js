import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { BaseDocumentDto, EXAMPLE_OBJECT_ID } from 'src/common/swagger/swagger.helpers';

/** Populated reference containing only the name */
export class RefNameDto {
  @ApiProperty({ example: EXAMPLE_OBJECT_ID })
  _id!: string;

  @ApiProperty({ example: 'Smartphones' })
  name!: string;
}

const refOrId = (description: string) => ({
  description,
  oneOf: [{ type: 'string', example: EXAMPLE_OBJECT_ID }, { $ref: getSchemaPath(RefNameDto) }],
});

@ApiExtraModels(RefNameDto)
export class ProductResponseDto extends BaseDocumentDto {
  @ApiProperty({ example: 'Apple iPhone 15 Pro 256GB' })
  title!: string;

  @ApiProperty({ example: 'Titanium design, A17 Pro chip, 48MP main camera and USB-C.' })
  description!: string;

  @ApiProperty({ example: 50, description: 'Quantity in stock' })
  quantity!: number;

  @ApiProperty({ example: 'https://example.com/images/iphone-15-cover.jpg' })
  imageCover!: string;

  @ApiProperty({ type: [String], example: ['https://example.com/images/iphone-15-1.jpg'] })
  images!: string[];

  @ApiProperty({ example: 0, description: 'Units sold' })
  sold!: number;

  @ApiProperty({ example: 999.99 })
  price!: number;

  @ApiPropertyOptional({ example: 899.99 })
  priceAfterDiscount?: number;

  @ApiPropertyOptional({ type: [String], example: ['black', 'silver'] })
  colors?: string[];

  @ApiProperty(refOrId('Category: an ObjectId string on create, or `{ _id, name }` when populated (list, get, update)'))
  category!: string | RefNameDto;

  @ApiPropertyOptional(refOrId('SubCategory: an ObjectId string on create, or `{ _id, name }` when populated (list, get, update)'))
  subCategory?: string | RefNameDto;

  @ApiPropertyOptional(refOrId('Brand: an ObjectId string on create, or `{ _id, name }` when populated (list, get, update)'))
  brand?: string | RefNameDto;

  @ApiProperty({ example: 0, description: 'Average rating' })
  rateingAverage!: number;

  @ApiProperty({ example: 0, description: 'Number of ratings' })
  rateingCount!: number;
}
