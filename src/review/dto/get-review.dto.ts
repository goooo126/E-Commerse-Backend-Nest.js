import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetReviewDto {
  @ApiPropertyOptional({ description: 'Page size (service default 10)', type: Number, default: 10, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Number of documents to skip (service default 0)', type: Number, default: 0, example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;
}
