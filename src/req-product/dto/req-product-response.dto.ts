import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { BaseDocumentDto, EXAMPLE_OBJECT_ID } from 'src/common/swagger/swagger.helpers';

/** Populated requester (name and email are selected) */
export class ReqProductUserDto {
  @ApiProperty({ example: EXAMPLE_OBJECT_ID })
  _id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;
}

@ApiExtraModels(ReqProductUserDto)
export class ReqProductResponseDto extends BaseDocumentDto {
  @ApiProperty({ example: 'Sony WH-1000XM5 headphones' })
  titleName!: string;

  @ApiProperty({ example: 'Black color, with the original carrying case.' })
  details!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  quantity!: number;

  @ApiPropertyOptional({ example: 'Electronics' })
  category?: string;

  @ApiProperty({
    description:
      'Requesting user: `{ _id, name, email }` when populated (create, get, update, and the admin list), otherwise an ObjectId string (the list for a regular user)',
    oneOf: [{ type: 'string', example: EXAMPLE_OBJECT_ID }, { $ref: getSchemaPath(ReqProductUserDto) }],
  })
  user!: string | ReqProductUserDto;
}
