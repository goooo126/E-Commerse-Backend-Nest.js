import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsOptional()
    @IsString({message:"The payment status must be string"})
    @IsEnum(['pending','paid','failed'],{message:"The paymentStauts must be in the enum"})
    paymentStatus!:string

    @IsOptional()
    @IsBoolean({message:"The is paid must be boolean"})
    isPaid!:boolean;

    @IsOptional()
    @IsBoolean({message:"The is Delivered must be boolean"})
    isDelivered!:boolean;
}
