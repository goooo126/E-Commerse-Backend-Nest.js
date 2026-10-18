import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { User } from 'src/user/user.schema';
import { Tax } from 'src/tax/tax.schema';
import { StripeService } from 'src/stripe/stripe.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Tax.name) private readonly taxModel: Model<Tax>,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckoutSession(orderId: string, totalAmount: number) {
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new BadRequestException('Invalid order amount');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!frontendUrl) {
      throw new InternalServerErrorException('FRONTEND_URL is not configured');
    }

    const stripe = this.stripeService.getClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],

      client_reference_id: orderId,

      metadata: {
        orderId,
      },

      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}/payment/cancel?orderId=${encodeURIComponent(orderId)}`,
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  
async create(
  createOrderDto: CreateOrderDto,
  user: { id: string; role: string },
) {
  // 1. Check whether the user has a cart
  const cart = await this.cartModel.findOne({ user: user.id });

  if (!cart) {
    throw new NotFoundException('This user does not have a cart');
  }

  // 2. Check whether the user exists
  const existedUser = await this.userModel.findById(user.id);

  if (!existedUser) {
    throw new NotFoundException('The user was not found');
  }

  // 3. Validate the shipping address
  const address = createOrderDto.address;

  if (!address) {
    throw new BadRequestException('The shipping address is required');
  }

  // 4. Retrieve tax and shipping prices
  const taxPrice = await this.taxModel.findOne({
    name: 'productTax',
  });

  const shippingPrice = await this.taxModel.findOne({
    name: 'shippingTax',
  });

  if (!taxPrice || !shippingPrice) {
    throw new NotFoundException(
      'Tax or shipping configuration was not found',
    );
  }

  // 5. Validate the cart total
  const subtotal = cart.totalPriceAfterDiscount;

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new BadRequestException('The cart total is invalid');
  }

  if (!cart.cartItems || cart.cartItems.length === 0) {
    throw new BadRequestException('The cart is empty');
  }

  // 6. Calculate the final amount on the server
  const totalOrderPrice =
    subtotal + taxPrice.price + shippingPrice.price;

  if (
    !Number.isFinite(totalOrderPrice) ||
    totalOrderPrice <= 0
  ) {
    throw new BadRequestException('The order total is invalid');
  }

  const paymentMethod = createOrderDto.paymentMethod ?? 'card';

  if (!['cash', 'card'].includes(paymentMethod)) {
    throw new BadRequestException('The payment method is invalid');
  }

  const orderData = {
    user: user.id,
    cartItems: cart.cartItems,
    taxPrice: taxPrice.price,
    shippingPrice: shippingPrice.price,
    totalOrderPrice,
    paymentMethod,
    address,
  };

  // 7. Cash payment: preserve the existing flow
  if (paymentMethod === 'cash') {
    const newOrder = await this.orderModel.create({
      ...orderData,
      isPaid: false,
      isDelivered: false,
      paymentStatus: 'pending',
    });

    return {
      status: 201,
      message: 'The order was created successfully',
      data: newOrder,
    };
  }

  // 8. Card payment: create a pending order first
  const newOrder = await this.orderModel.create({
    ...orderData,
    isPaid: false,
    isDelivered: false,
    paymentStatus: 'pending',
  });

  try {
    // 9. Create a Stripe Checkout Session
    const session = await this.createCheckoutSession(
      newOrder._id.toString(),
      newOrder.totalOrderPrice,
    );

    if (!session.checkoutUrl) {
      throw new InternalServerErrorException(
        'Stripe did not return a checkout URL',
      );
    }

    // 10. Save the Stripe session ID in MongoDB
    newOrder.stripeCheckoutSessionId = session.sessionId;
    await newOrder.save();

    // 11. Return the checkout URL to the frontend
    return {
      status: 201,
      message: 'Checkout session created successfully',
      data: {
        orderId: newOrder._id,
        paymentStatus: newOrder.paymentStatus,
        checkoutUrl: session.checkoutUrl,
        sessionId: session.sessionId,
      },
    };
  } catch (error) {
    // Do not leave an order behind if checkout setup fails.
    await this.orderModel.findByIdAndDelete(newOrder._id);
    throw error;
  }
}


  async findAll(user: { id: string; role: string }) {
    return `This action returns all order`;
  }

  async findOne(id: string, user: { id: string; role: string }) {
    return `This action returns a #${id} order`;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: { id: string; role: string },
  ) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string, user: { id: string; role: string }) {
    return `This action removes a #${id} order`;
  }
}
