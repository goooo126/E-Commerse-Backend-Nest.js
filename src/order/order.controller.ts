import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';
import {
  CheckoutSessionResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetOrderDto } from './dto/get-order.dto';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //?=======================================
  //* @Docs   User can create new order
  //* @Route  POST /api/v1/order
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Create an order from the cart',
    description:
      'Creates an order from the authenticated user\'s cart. **Access:** User only. The total is computed on the server: `cart.totalPriceAfterDiscount + productTax + shippingTax`. With `paymentMethod: "cash"` the order is created immediately, stock is deducted and the cart is deleted. With `paymentMethod: "card"` (default) a pending order and a Stripe Checkout session (currency EGP) are created: the client MUST redirect the user to `data.checkoutUrl`; the order is marked paid, stock deducted and the cart cleared later by the Stripe webhook. If the checkout session cannot be created the pending order is deleted. The two response shapes are described under `data`.',
  })
  @ApiExtraModels(OrderResponseDto, CheckoutSessionResponseDto)
  @ApiResponse({
    status: 201,
    description:
      'Order created. `data` is the order for cash payments, or the checkout session info for card payments',
    schema: {
      oneOf: [
        {
          type: 'object',
          description: 'paymentMethod = cash',
          properties: {
            status: { type: 'number', example: 201 },
            message: { type: 'string', example: 'The order was created successfully' },
            data: { $ref: getSchemaPath(OrderResponseDto) },
          },
        },
        {
          type: 'object',
          description: 'paymentMethod = card (redirect the user to data.checkoutUrl)',
          properties: {
            status: { type: 'number', example: 201 },
            message: { type: 'string', example: 'Checkout session created successfully' },
            data: { $ref: getSchemaPath(CheckoutSessionResponseDto) },
          },
        },
      ],
    },
  })
  @ApiErrors(
    [400, 'Validation failed, address missing, cart empty/invalid total, invalid payment method, or insufficient stock (cash)'],
    [404, 'The user has no cart, the user was not found, or the tax/shipping configuration was not found'],
    [500, 'FRONTEND_URL is not configured, or Stripe did not return a checkout URL'],
  )
  @ApiPrivate('user')
  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  //?=======================================
  //* @Docs   User can get all his/her orders, admin can get all orders
  //* @Route  GET /api/v1/order
  //* @access Private['user','admin']
  //?=======================================
  @ApiOperation({
    summary: 'List orders',
    description:
      'Returns a paginated list of orders. **Access:** Admin, User. Admin gets all orders; a user gets only their own orders. `limit` defaults to 10 and `skip` to 0.',
  })
  @ApiEnvelopeResponse({
    description: 'Paginated orders',
    message: 'The order fetched successfully',
    list: { key: 'orders', model: OrderResponseDto },
  })
  @ApiErrors([400, 'Validation failed (limit and skip must be numbers)'])
  @ApiPrivate('admin', 'user')
  @Get()
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @CurrentUser() user: any,
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetOrderDto,
  ) {
    return this.orderService.findAll(user,query);
  }

  //?=======================================
  //* @Docs   User can get  his/her order, admin can get any order
  //* @Route  GET /api/v1/order/:id
  //* @access Private['user','admin']
  //?=======================================
  @ApiOperation({
    summary: 'Get an order by id',
    description:
      'Returns a single order. **Access:** Admin (any order), User (own orders only; otherwise 401).',
  })
  @ApiMongoIdParam('id', 'Order id')
  @ApiEnvelopeResponse({
    description: 'The order',
    message: 'The order found',
    model: OrderResponseDto,
  })
  @ApiErrors(
    [404, 'The order is not found'],
    [401, 'Missing/invalid token, or the order does not belong to the user'],
  )
  @ApiPrivate('admin', 'user')
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.findOne(id, user);
  }

  //?=======================================
  //* @Docs   admin can update the order only
  //* @Route  PATCH /api/v1/order/:id/status
  //* @access Private['admin']
  //?=======================================
  @ApiOperation({
    summary: 'Update order status',
    description:
      'Updates the payment/delivery status of an order. **Access:** Admin only. Only `paymentStatus`, `isPaid` and `isDelivered` are applied; `paymentMethod` and `address` are accepted by validation but ignored. Note: the returned `data` is the order as it was BEFORE the update.',
  })
  @ApiMongoIdParam('id', 'Order id')
  @ApiEnvelopeResponse({
    description: 'Order updated (data is the document before the update)',
    message: 'update the order successfully',
    model: OrderResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed (paymentStatus must be pending|paid|failed, isPaid/isDelivered must be booleans)'],
    [404, 'The order is not found'],
  )
  @ApiPrivate('admin')
  @Patch(':id/status')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.updateStatus(id, updateOrderDto, user);
  }

  //?=======================================
  //* @Docs   User can delete the order
  //* @Route  DELETE /api/v1/order/:id
  //* @access Private['user']
  //?=======================================
  @ApiOperation({
    summary: 'Delete an order',
    description:
      'Permanently deletes one of the user\'s own orders (no status condition is checked; stock is not restored). **Access:** User only. Returns HTTP 200 with an empty body. An order owned by someone else is reported as not found.',
  })
  @ApiMongoIdParam('id', 'Order id')
  @ApiResponse({ status: 200, description: 'Order deleted (empty body)' })
  @ApiErrors([404, 'The order is not found or does not belong to the user'])
  @ApiPrivate('user')
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.remove(id, user);
  }
}
