import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

export class BrandResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Brand name', example: 'Samsung' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Brand image URL',
    example: 'https://example.com/images/samsung.png',
  })
  image?: string;
}
