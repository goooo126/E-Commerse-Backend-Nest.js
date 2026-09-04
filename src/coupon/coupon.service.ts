import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import { GetCouponsDto } from './dto/get-coupon-dto';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async create(createCouponDto: CreateCouponDto) {
    //* check if the coupon name is existed:
    const coupon = await this.couponModel
      .findOne({ name: createCouponDto.name })
      .select('-__V');

    if (coupon) {
      throw new BadRequestException('The coupon Name is already existed');
    }

    //* check the date:
    const now = new Date();
    const exipreDate = new Date(createCouponDto.expireDate);
    if (now >= exipreDate) {
      throw new BadRequestException('Coupon has expired');
    }

    //* create new coupon:
    const newCoupon = await this.couponModel.create(createCouponDto);

    return {
      statuse: 201,
      message: 'Coupon is create successfully :)',
      data: newCoupon,
    };
  }

  async findAll(query: GetCouponsDto) {
    const {
      limit = 10,
      skip = 0,
      sort = 'createdAt',
      order = 'desc',
      name,
      expireDate,
      discount,
    } = query;


    const filter: any = {};

    if (name) {
      filter.name = {
        $regex: name,
        $options: 'i',
      };
    }

    if (expireDate) {
      filter.expireDate = new Date(expireDate);
    }

    if (discount !== undefined) {
      filter.discount = discount;
    }

    const sortOptions: Record<string, SortOrder> = {
      [sort]: order === 'asc' ? 1 : -1,
    };

    const [coupons, total] = await Promise.all([
      this.couponModel
        .find(filter)
        .select('-__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      this.couponModel.countDocuments(filter),
    ]);

    return {
      status: 200,
      message: 'coupons fetched successfully',
      data: {
        coupons,
        pagination: {
          total,
          limit,
          skip,
          returned: coupons.length,
        },
      },
    };
  }

  async findOne(id: string) {
    //* check if the id is valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is invalid id');
    }

    //* check if the coupon is existed:
    const coupon = await this.couponModel.findById(id).select('-__V');
    if (!coupon) {
      throw new NotFoundException('Coupon is not founded');
    }

    return {
      status: 200,
      message: 'The coupon is founded successfully',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    //* check if the id is valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is invalid id');
    }

    //* check if the coupon is existed:
    const coupon = await this.couponModel.findById(id).select('-__V');
    if (!coupon) {
      throw new NotFoundException('Coupon is not founded');
    }

    //* validation on coupon name:
    if (updateCouponDto.name) {
      const existedCoupon = await this.couponModel.findOne({
        name: updateCouponDto.name,
        _id: { $ne: id },
      });

      if (existedCoupon) {
        throw new BadGatewayException('This coupon is already existed');
      }
    }

    //*  validation on coupon expireDate:
    if (updateCouponDto.expireDate) {
      const now = new Date();
      const exipreDate = new Date(updateCouponDto.expireDate);

      if (now >= exipreDate) {
        throw new BadRequestException('Coupon has expired');
      }
    }

    const updatedCoupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true },
    );

    return {
      status: 200,
      message: 'The Coupon is updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string): Promise<void> {
    //* check if the id is valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is invalid id');
    }

    //* check if the coupon is existed:
    const coupon = await this.couponModel.findById(id).select('-__V');
    if (!coupon) {
      throw new NotFoundException('Coupon is not founded');
    }

    await this.couponModel.findByIdAndDelete(id);
  }
}
