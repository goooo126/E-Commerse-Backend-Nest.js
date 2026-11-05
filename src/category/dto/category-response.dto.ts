import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

export class CategoryResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/images/electronics.png',
  })
  image?: string;
}
