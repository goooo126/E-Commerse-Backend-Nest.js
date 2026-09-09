import { PartialType } from '@nestjs/mapped-types';
import { CreateReqProductDto } from './create-req-product.dto';

export class UpdateReqProductDto extends PartialType(CreateReqProductDto) {}
