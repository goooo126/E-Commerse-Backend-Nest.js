import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/role.guard';
import { GetCouponsDto } from './dto/get-coupon-dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  //?=======================================
  //* @Docs   Admin can create new Coupon
  //* @Route  POST /api/v1/coupon
  //* @access Private['amdin']
  //?=======================================
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  create(@Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  //?=======================================
  //* @Docs   Admin can get all Coupon
  //* @Route  GET /api/v1/coupon
  //* @access Private['amdin']
  //?=======================================
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  findAll(@Query() query:GetCouponsDto) {
    return this.couponService.findAll(query);
  }


  //?=======================================
  //* @Docs   Admin can get a single Coupon
  //* @Route  GET /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  //?=======================================
  //* @Docs   Admin can update a Coupon
  //* @Route  PATCH /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),) updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }


  //?=======================================
  //* @Docs   Admin can delete a Coupon
  //* @Route  DELETE /api/v1/coupon/:id
  //* @access Private['amdin']
  //?=======================================
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
