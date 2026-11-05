import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCartDto {
  @ApiPropertyOptional({ description: 'Max number of carts to return (admin only)', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Number of carts to skip (admin only)', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional({ description: 'Only carts with totalPrice >= this value (admin only)', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotalPrice?: number;

  @ApiPropertyOptional({ description: 'Only carts with totalPrice <= this value (admin only)', example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotalPrice?: number;

  @ApiPropertyOptional({
    description: 'Sort direction by totalPrice (admin only)',
    enum: ['asc', 'desc'],
    default: 'asc',
    example: 'asc',
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
