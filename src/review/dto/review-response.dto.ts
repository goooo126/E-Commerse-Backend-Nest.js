import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { BaseDocumentDto, EXAMPLE_OBJECT_ID } from 'src/common/swagger/swagger.helpers';

/** Populated reviewer (only the name is selected) */
export class ReviewUserDto {
  @ApiProperty({ example: EXAMPLE_OBJECT_ID })
  _id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;
}

@ApiExtraModels(ReviewUserDto)
export class ReviewResponseDto extends BaseDocumentDto {
  @ApiPropertyOptional({ example: 'Great phone, battery lasts all day.', minLength: 3 })
  reviewText?: string;

  @ApiProperty({ example: 5, minimum: 0, maximum: 5 })
  rating!: number;

  @ApiProperty({
    description:
      'Reviewer: an ObjectId string, or `{ _id, name }` when populated (the review list populates it)',
    oneOf: [{ type: 'string', example: EXAMPLE_OBJECT_ID }, { $ref: getSchemaPath(ReviewUserDto) }],
  })
  user!: string | ReviewUserDto;

  @ApiProperty({ example: EXAMPLE_OBJECT_ID, description: 'Reviewed product ObjectId' })
  product!: string;
}
