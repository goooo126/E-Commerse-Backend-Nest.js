import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Tax, TaxSchema } from 'src/tax/tax.schema';
import { StripeModule } from 'src/stripe/stripe.module';
import { Product, ProductSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Tax.name, schema: TaxSchema },
      {name: Product.name, schema:ProductSchema}
    ]),
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
