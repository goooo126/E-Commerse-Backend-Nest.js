import { Module } from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { ReqProductController } from './req-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReqProduct, ReqProductSchema } from './req-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReqProduct.name, schema: ReqProductSchema },
    ]),
  ],
  controllers: [ReqProductController],
  providers: [ReqProductService],
})
export class ReqProductModule {}
