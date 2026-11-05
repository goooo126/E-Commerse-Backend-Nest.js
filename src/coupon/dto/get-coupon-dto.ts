import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetCouponsDto {
  @ApiPropertyOptional({ description: 'Maximum number of coupons to return (page size)', default: 10, minimum: 1, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Number of coupons to skip (offset)', default: 0, minimum: 0, example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Field to sort by', enum: ['name', 'createdAt', 'expireDate', 'discount'], default: 'createdAt' })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'createdAt', 'expireDate', 'discount'])
  sort?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort direction', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';

  @ApiPropertyOptional({ description: 'Filter by coupon name (case-insensitive partial match)', example: 'summer' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by exact expiration date (currently cannot be used from the query string: the value is not transformed to a Date, so validation always fails)', type: String, format: 'date-time', example: '2027-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDate()
  expireDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by exact discount percentage. NOTE: because the default is 0 and the service filters whenever the value is defined, omitting it filters coupons with discount = 0', default: 0, minimum: 0, example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discount?: number = 0;
}
