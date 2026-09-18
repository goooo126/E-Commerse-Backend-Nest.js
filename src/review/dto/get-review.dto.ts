import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;
}
