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
import { CartResponseDto } from './dto/cart-response.dto';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetCartDto } from './dto/get-cart.dto';
import { User } from 'src/user/user.schema';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //?=======================================
  //* @Docs   Only User can create or add product to his cart
  //* @Route  POST /api/v1/cart
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Add a product to the cart',
    description:
      'Adds a product to the authenticated user\'s cart. **Access:** User only. If the user has no cart yet a new one is created; otherwise the product is appended (or its quantity is increased when it is already in the cart) and the totals are updated. The product must exist and have at least the requested quantity in stock. `quantity` defaults to 1 and `color` to an empty string. The HTTP status is always 201; the `status` field in the body is 200 when added to an existing cart and 201 when a new cart was created.',
  })
  @ApiEnvelopeResponse({
    status: 201,
    bodyStatus: 201,
    description:
      'Product added. Body `status` is 201 for a newly created cart (message "The Product added successfully") or 200 when added to an existing cart (message "The product added successfully")',
    message: 'The Product added successfully',
    model: CartResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed (invalid product id, quantity not an integer >= 1, color not a string)'],
    [404, 'The product is not found or the requested quantity is unavailable'],
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
    createCartDto: CreateCartDto,
    @CurrentUser() user,
  ) {
    return this.cartService.create(createCartDto, user);
  }

  //?=======================================
  //* @Docs   Admin can get all carts or user get his cart
  //* @Route  GET /api/v1/product/cart
  //* @access Private(['admin',user])
  //?=======================================
  @ApiOperation({
    summary: 'Get carts',
    description:
      'Admin: returns a paginated list of all carts (with `user` populated as name/email), filterable by `minTotalPrice`/`maxTotalPrice` and sorted by `totalPrice` (`order`, default asc; `limit` default 10, `skip` default 0). User: returns the user\'s own cart (query params are ignored) or 404 when the user has no cart. **Access:** Admin, User. The shape of `data` depends on the role.',
  })
  @ApiExtraModels(CartResponseDto)
  @ApiResponse({
    status: 200,
    description:
      'Admin receives `data: { carts, pagination }`; user receives `data: <cart>`',
    schema: {
      oneOf: [
        {
          type: 'object',
          description: 'Admin response',
          properties: {
            status: { type: 'number', example: 200 },
            message: { type: 'string', example: 'carts fetched successfully' },
            data: {
              type: 'object',
              properties: {
                carts: {
                  type: 'array',
                  items: { $ref: getSchemaPath(CartResponseDto) },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'number', example: 42 },
                    limit: { type: 'number', example: 10 },
                    skip: { type: 'number', example: 0 },
                    returned: { type: 'number', example: 10 },
                  },
                },
              },
            },
          },
        },
        {
          type: 'object',
          description: 'User response',
          properties: {
            status: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Cart fetched successfully' },
            data: { $ref: getSchemaPath(CartResponseDto) },
          },
        },
      ],
    },
  })
  @ApiErrors(
    [400, 'Validation failed (limit, skip, minTotalPrice, maxTotalPrice must be numbers)'],
    [404, 'The user has no cart (user role only)'],
  )
  @ApiPrivate('admin', 'user')
  @Get()
  @Roles(Role.Admin,Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetCartDto,
    @CurrentUser() user,
  ) {
    return this.cartService.findAll(query,user);
  }

  //?=======================================
  //* @Docs   Admin can get single cart 
  //* @Route  GET /api/v1/product/cart/:cartId
  //* @access Private(['admin','user'])
  //?=======================================
  @ApiOperation({
    summary: 'Get a cart by id',
    description:
      'Returns a single cart by its id, with `cartItems.product` populated (title, imageCover, price) and `user` populated (name). **Access:** Admin only.',
  })
  @ApiMongoIdParam('id', 'Cart id')
  @ApiEnvelopeResponse({
    description: 'The cart',
    message: 'The cart is founed',
    model: CartResponseDto,
  })
  @ApiErrors(
    [400, 'The cart id is not a valid ObjectId'],
    [404, 'The cart is not found'],
  )
  @ApiPrivate('admin')
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  //?=======================================
  //* @Docs   User can apply a coupon in his cart
  //* @Route  DELETE /api/v1/product/cart/coupon
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Apply a coupon to the cart',
    description:
      'Applies a coupon (by name) to the user\'s cart and recalculates `totalPriceAfterDiscount = totalPrice - totalPrice * discount / 100`. **Access:** User only. Only one coupon can be applied at a time, and expired coupons are rejected.',
  })
  @ApiEnvelopeResponse({
    description: 'Coupon applied; returns the updated cart',
    message: 'the coupon is applied successfully',
    model: CartResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed, a coupon is already applied, or the coupon is expired'],
    [404, 'The user does not have a cart, or the coupon does not exist'],
  )
  @ApiPrivate('user')
  @Patch('coupon')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  apllyCoupon(@Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    applyCoupon: ApplyCouponDto,@CurrentUser() user) {
    return this.cartService.apllyCoupon(applyCoupon,user);
  }

  //?=======================================
  //* @Docs   User can apply a coupon in his cart
  //* @Route  DELETE /api/v1/product/cart/coupon
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Remove the applied coupon',
    description:
      'Removes the coupon from the user\'s cart and resets `totalPriceAfterDiscount` to `totalPrice`. **Access:** User only.',
  })
  @ApiEnvelopeResponse({
    description: 'Coupon removed; returns the updated cart',
    message: 'Coupon removed successfully',
    model: CartResponseDto,
  })
  @ApiErrors(
    [400, 'No coupon applied to the cart'],
    [404, 'The user does not have a cart'],
  )
  @ApiPrivate('user')
  @Delete('coupon')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  deleteCoupon(@CurrentUser() user) {
    return this.cartService.removeCoupon(user);
  }
  
  //?=======================================
  //* @Docs   User can update products in his cart
  //* @Route  PATCH /api/v1/product/cart/:productId
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Update a product in the cart',
    description:
      'Updates the quantity and/or color of a product already in the user\'s cart. **Access:** User only. The `id` path parameter is the PRODUCT id (not the cart id). When `quantity` is sent it must not exceed the product stock; totals are then recalculated from current product prices (any applied coupon discount is NOT re-applied: `totalPriceAfterDiscount` is reset to `totalPrice`). Only `quantity` and `color` are used; a `product` field in the body is ignored.',
  })
  @ApiMongoIdParam('id', 'Product id inside the cart')
  @ApiEnvelopeResponse({
    description: 'Cart updated; returns the updated cart',
    message: 'Update the cart successfully',
    model: CartResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed, or the requested quantity exceeds the available stock'],
    [404, 'The cart or the product is not found, or the product is not in the cart'],
  )
  @ApiPrivate('user')
  @Patch(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateCartDto: UpdateCartDto,
    @CurrentUser() user,
  ) {
    return this.cartService.update(id, updateCartDto, user);
  }

  //?=======================================
  //* @Docs   User can delete his cart
  //* @Route  DELETE /api/v1/product/cart
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Delete the whole cart',
    description:
      'Deletes the authenticated user\'s entire cart. **Access:** User only. Returns HTTP 200 with an empty body.',
  })
  @ApiResponse({ status: 200, description: 'Cart deleted (empty body)' })
  @ApiErrors([404, 'The cart is not found'])
  @ApiPrivate('user')
  @Delete()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  removeCart(@CurrentUser() user) {
    return this.cartService.removeCart(user);
  }

  //?=======================================
  //* @Docs   User can delete a product in his cart
  //* @Route  DELETE /api/v1/product/cart/:id
  //* @access Private(['user'])
  //?=======================================
  @ApiOperation({
    summary: 'Remove a product from the cart',
    description:
      'Removes one product from the user\'s cart and recalculates the totals (`totalPriceAfterDiscount` is reset to `totalPrice`). **Access:** User only. The `id` path parameter is the PRODUCT id (not the cart id).',
  })
  @ApiMongoIdParam('id', 'Product id inside the cart')
  @ApiEnvelopeResponse({
    description: 'Product removed; returns the updated cart',
    message: 'The Product is delete successfully',
    model: CartResponseDto,
  })
  @ApiErrors([404, "The user doesn't have a cart, or the product is not in the cart"])
  @ApiPrivate('user')
  @Delete(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.cartService.removeProduct(id, user);
  }


}
