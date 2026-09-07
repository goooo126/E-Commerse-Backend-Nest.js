import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReqProduct } from './req-product.schema';
import { Model } from 'mongoose';
import { GetReqProductsDto } from './dto/get-reqProducts.dto';

@Injectable()
export class ReqProductService {
  constructor(
    @InjectModel(ReqProduct.name) private reqProductModel: Model<ReqProduct>,
  ) {}

  async create(createReqProductDto: CreateReqProductDto, user) {
    //* check if the same user request the same product:
    const existedReqProduct = await this.reqProductModel.findOne({
      titleName: createReqProductDto.titleName,
      user: user.id,
    });
    if (existedReqProduct) {
      throw new BadRequestException('The Request Product already existed');
    }

    //* create new Request product:
    const newReqProduct = await this.reqProductModel.create({
      ...createReqProductDto,
      user: user.id,
    });

    return {
      status: 201,
      message: 'The Request product created successfully',
      data: newReqProduct,
    };
  }

  async findAll(user, query: GetReqProductsDto) {
    const { limit = 10, skip = 0 } = query;

    //* check the role Admin:
    if (user.role === 'admin') {
      const [reqProducts, total] = await Promise.all([
        this.reqProductModel.find().select('-__v').skip(skip).limit(limit),
        this.reqProductModel.countDocuments(),
      ]);

      return {
        status: 200,
        message: 'The reqProducts fetchs successfully',
        data: {
          reqProducts,
          pagination: {
            total,
            limit,
            skip,
            returned: reqProducts.length,
          },
        },
      };
    }

    //* check the role User:
    if (user.role === 'user') {
      const [reqProducts, total] = await Promise.all([
        this.reqProductModel
          .find({ user: user.id })
          .select('-__v')
          .skip(skip)
          .limit(limit),
        this.reqProductModel.countDocuments({ user: user.id }),
      ]);

      return {
        status: 200,
        message: 'The reqProducts fetchs successfully',
        data: {
          reqProducts,
          pagination: {
            total,
            limit,
            skip,
            returned: reqProducts.length,
          },
        },
      };
    }
  }

  async findOne(id: string, user) {
    return `This action returns a #${id} reqProduct`;
  }

  update(id: string, updateReqProductDto: UpdateReqProductDto, user) {
    return `This action updates a #${id} reqProduct`;
  }

  remove(id: string, user) {
    return `This action removes a #${id} reqProduct`;
  }
}
