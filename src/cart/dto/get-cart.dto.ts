import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCartDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotalPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotalPrice?: number;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
