import { ApiProperty } from '@nestjs/swagger';
import { BaseDocumentDto } from 'src/common/swagger/swagger.helpers';

export class SupplierResponseDto extends BaseDocumentDto {
  @ApiProperty({ description: 'Supplier name', example: 'Global Tech Supplies' })
  name!: string;

  @ApiProperty({
    description: 'Supplier website URL',
    example: 'https://globaltech.example.com',
  })
  website!: string;
}
