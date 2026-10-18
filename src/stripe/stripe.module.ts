
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/order.schema';
import { Product, ProductSchema } from 'src/product/product.schema';
import { Cart, CartSchema } from 'src/cart/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
       { name: Product.name, schema: ProductSchema },
       {name: Cart.name,schema:CartSchema}
    ]),
  ],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
