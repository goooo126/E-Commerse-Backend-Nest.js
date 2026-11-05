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
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { GetCouponsDto } from './dto/get-coupon-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrors,
  ApiMongoIdParam,
  ApiPrivate,
} from 'src/common/swagger/swagger.helpers';
import { CouponResponseDto } from './dto/coupon-response.dto';

@ApiTags('Coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  //?=======================================
  //* @Docs   Admin can create new Coupon
  //* @Route  POST /api/v1/coupon
  //* @access Private['amdin']
  //?=======================================
  @ApiOperation({
    summary: 'Create a coupon',
    description:
      'Creates a new discount coupon. **Access:** Admin. The coupon name must be unique and the expiration date must be in the future. The response body contains the misspelled key `statuse` (instead of `status`).',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    status: 201,
    noStatus: true,
    description: 'Coupon created',
    message: 'Coupon is create successfully :)',
    model: CouponResponseDto,
    extra: { statuse: { type: 'number', example: 201 } },
  })
  @ApiErrors(
    [400, 'Validation failed, the coupon name already exists, or the expiration date is not in the future (\'Coupon has expired\')'],
  )
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    createCouponDto: CreateCouponDto,
  ) {
    return this.couponService.create(createCouponDto);
  }

  //?=======================================
  //* @Docs   Admin can get all Coupon
  //* @Route  GET /api/v1/coupon
  //* @access Private['amdin']
  //?=======================================
  @ApiOperation({
    summary: 'List coupons',
    description:
      'Returns a paginated list of coupons with optional filters and sorting. **Access:** Admin. Defaults: limit 10, skip 0, sorted by createdAt descending. Note: the `discount` filter defaults to 0, so when it is omitted only coupons with discount 0 are matched; `expireDate` cannot currently be used from the query string.',
  })
  @ApiPrivate('admin')
  @ApiEnvelopeResponse({
    description: 'Coupons fetched',
    message: 'coupons fetched successfully',
    bodyStatus: 200,
    list: { key: 'coupons', model: CouponResponseDto },
  })
  @ApiErrors([400, 'Invalid query parameters'])
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: GetCouponsDto,
  ) {
    return this.couponService.findAll(query);
  }

  //?=======================================
  //* @Docs   Admin can get a single Coupon
  //* @Route  GET /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @ApiOperation({
    summary: 'Get a coupon by id',
    description: 'Returns a single coupon. **Access:** Admin.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'Coupon ObjectId')
  @ApiEnvelopeResponse({
    description: 'Coupon found',
    message: 'The coupon is founded successfully',
    model: CouponResponseDto,
  })
  @ApiErrors([400, 'Invalid ObjectId'], [404, 'Coupon not found'])
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a Coupon
  //* @Route  PATCH /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @ApiOperation({
    summary: 'Update a coupon',
    description:
      'Partially updates a coupon (all body fields optional). **Access:** Admin. A new name must not be used by another coupon (the service answers 502 Bad Gateway in that case) and a new expiration date must be in the future.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'Coupon ObjectId')
  @ApiEnvelopeResponse({
    description: 'Coupon updated',
    message: 'The Coupon is updated successfully',
    model: CouponResponseDto,
  })
  @ApiErrors(
    [400, 'Validation failed, invalid ObjectId, or the expiration date is not in the future'],
    [404, 'Coupon not found'],
    [502, 'Another coupon already uses this name (Bad Gateway is thrown by the service)'],
  )
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  //?=======================================
  //* @Docs   Admin can delete a Coupon
  //* @Route  DELETE /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @ApiOperation({
    summary: 'Delete a coupon',
    description: 'Deletes a coupon permanently. **Access:** Admin. Returns HTTP 200 with an empty body.',
  })
  @ApiPrivate('admin')
  @ApiMongoIdParam('id', 'Coupon ObjectId')
  @ApiResponse({ status: 200, description: 'Coupon deleted (empty body)' })
  @ApiErrors([400, 'Invalid ObjectId'], [404, 'Coupon not found'])
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
