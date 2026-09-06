import { Module } from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { ReqProductController } from './req-product.controller';

@Module({
  controllers: [ReqProductController],
  providers: [ReqProductService],
})
export class ReqProductModule {}
