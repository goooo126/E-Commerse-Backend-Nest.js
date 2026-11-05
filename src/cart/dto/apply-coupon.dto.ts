import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";

export class ApplyCouponDto {
  //* Name:
  @ApiProperty({
    description: 'Name of the coupon to apply',
    example: 'SUMMER25',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'the name of coupon must be string' })
  @MinLength(3, { message: 'The Coupon must at least 3 characters' })
  @MaxLength(100, { message: 'The Coupon must at most 100 characters' })
  @IsDefined()
  name!: string;
  //*-----------------------------------------------
}
