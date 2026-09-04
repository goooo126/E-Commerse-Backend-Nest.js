import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}
  create(createCouponDto: CreateCouponDto) {
    return 'This action adds a new coupon';
  }

  findAll(query) {
    return `This action returns all coupon`;
  }

  findOne(id: string) {
    return `This action returns a #${id} coupon`;
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: string) {
    return `This action removes a #${id} coupon`;
  }
}
