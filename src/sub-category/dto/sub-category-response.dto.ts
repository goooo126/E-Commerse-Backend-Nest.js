import { ApiProperty } from '@nestjs/swagger';
import {
  BaseDocumentDto,
  EXAMPLE_OBJECT_ID,
} from 'src/common/swagger/swagger.helpers';
import { CategoryResponseDto } from 'src/category/dto/category-response.dto';

/** Sub-category as returned by the category sub-categories endpoint (category is an ObjectId, not populated) */
export class SubCategoryRefResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Sub-category name', example: 'iPhones' })
  name!: string;

  @ApiProperty({
    description: 'ObjectId of the parent category',
    example: EXAMPLE_OBJECT_ID,
  })
  category!: string;
}

/** Sub-category with its parent category populated (create, list, get, update endpoints) */
export class SubCategoryResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Sub-category name', example: 'iPhones' })
  name!: string;

  @ApiProperty({
    description: 'Parent category (populated)',
    type: () => CategoryResponseDto,
  })
  category!: CategoryResponseDto;
}
