import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { Connection, Model } from 'mongoose';
import { Order } from 'src/order/order.schema';
import { Product } from 'src/product/product.schema';
import { Cart } from 'src/cart/cart.schema';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Cart.name) private readonly cartModel:Model<Cart>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret || !signature || !req.rawBody) {
      throw new BadRequestException(
        'Missing webhook configuration or signature',
      );
    }

    const stripe = this.stripeService.getClient();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody!,
        signature!,
        webhookSecret,
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);

      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== 'paid') {
        return { received: true };
      }

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        throw new BadRequestException('Order ID is missing');
      }

      // Find the order linked to this exact Stripe session.
      const order = await this.orderModel.findOne({
        _id: orderId,
        paymentMethod: 'card',
        stripeCheckoutSessionId: session.id,
      });

      if (!order) {
        throw new BadRequestException('Matching order was not found');
      }

      // Verify the amount and currency before changing stock.
      const expectedAmount = Math.round(order.totalOrderPrice * 100);

      if (
        session.currency !== 'egp' ||
        session.amount_total !== expectedAmount
      ) {
        throw new BadRequestException(
          'Stripe payment amount or currency does not match the order',
        );
      }

      // Aggregate duplicate product entries in the order.
      const quantities = new Map<string, number>();

      for (const item of order.cartItems) {
        const productId = String(item.product);
        quantities.set(
          productId,
          (quantities.get(productId) ?? 0) + item.quantity,
        );
      }

      // Stock updates and payment confirmation must commit together.
      const mongoSession = await this.connection.startSession();

      try {
        await mongoSession.withTransaction(async () => {
          // Re-read the order within the transaction.
          const currentOrder = await this.orderModel
            .findById(orderId)
            .session(mongoSession);

          if (!currentOrder) {
            throw new BadRequestException('Order was not found');
          }

          // Duplicate webhook delivery must not deduct stock again.
          if (currentOrder.isPaid) {
            return;
          }

          if (
            currentOrder.stripeCheckoutSessionId !== session.id ||
            currentOrder.paymentMethod !== 'card'
          ) {
            throw new BadRequestException('Order/session mismatch');
          }

          // Deduct each product only if enough stock remains.
          for (const [productId, quantity] of quantities) {
            const updatedProduct = await this.productModel.findOneAndUpdate(
              {
                _id: productId,
                quantity: { $gte: quantity },
              },
              {
                $inc: {
                  quantity: -quantity,
                  sold: quantity,
                },
              },
              {
                new: true,
                session: mongoSession,
              },
            );

            if (!updatedProduct) {
              throw new BadRequestException(
                `Product ${productId} was not found or has insufficient stock`,
              );
            }
          }

          // Confirm payment in the same transaction.
          const updatedOrder = await this.orderModel.findOneAndUpdate(
            {
              _id: orderId,
              isPaid: false,
              stripeCheckoutSessionId: session.id,
            },
            {
              $set: {
                isPaid: true,
                paymentStatus: 'paid',
                paidAt: new Date(),
              },
            },
            {
              new: true,
              session: mongoSession,
            },
          );

          if (!updatedOrder) {
            throw new Error('Could not update the order payment status');
          }

          await this.cartModel.deleteOne({user:order.user});
        });
      } finally {
        await mongoSession.endSession();
      }
    }

    return { received: true };
  }
}
