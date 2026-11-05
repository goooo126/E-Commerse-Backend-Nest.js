import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetOrderDto {
  @ApiPropertyOptional({ description: 'Max number of orders to return', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Number of orders to skip', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;
}
