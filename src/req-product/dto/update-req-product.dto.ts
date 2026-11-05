import { PartialType } from '@nestjs/swagger';
import { CreateReqProductDto } from './create-req-product.dto';

export class UpdateReqProductDto extends PartialType(CreateReqProductDto) {}
