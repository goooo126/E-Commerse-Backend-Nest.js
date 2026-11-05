import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * Body of PATCH /order/:id/status.
 * Only `paymentStatus`, `isPaid` and `isDelivered` are applied by the service;
 * the inherited `paymentMethod` and `address` are accepted but ignored.
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiPropertyOptional({
      description: 'New payment status',
      enum: ['pending', 'paid', 'failed'],
      example: 'paid',
    })
    @IsOptional()
    @IsString({message:"The payment status must be string"})
    @IsEnum(['pending','paid','failed'],{message:"The paymentStauts must be in the enum"})
    paymentStatus!:string

    @ApiPropertyOptional({ description: 'Mark the order as paid / unpaid', example: true })
    @IsOptional()
    @IsBoolean({message:"The is paid must be boolean"})
    isPaid!:boolean;

    @ApiPropertyOptional({ description: 'Mark the order as delivered / not delivered', example: true })
    @IsOptional()
    @IsBoolean({message:"The is Delivered must be boolean"})
    isDelivered!:boolean;
}
