import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReqProduct } from './req-product.schema';
import mongoose, { Model } from 'mongoose';
import { GetReqProductsDto } from './dto/get-reqProducts.dto';
import { Role } from 'src/user/enums/roles.enum';

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

    await newReqProduct.populate({
      path: 'user',
      select: 'name email',
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
    if (user.role === Role.Admin) {
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
    if (user.role === Role.User) {
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
    //* check if the id is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The Id is not valid');
    }

    //* check if the reqProduct is existed:
    const existedReqProduct = await this.reqProductModel
      .findById(id)
      .select('-__v');
    if (!existedReqProduct) {
      throw new NotFoundException('The Request Product is not found');
    }

    //* Admin:
    if (user.role === Role.Admin) {
      await existedReqProduct.populate({
        path: 'user',
        select: 'name email',
      });
      return {
        status: 200,
        message: 'The Request Product founded successfully',
        data: existedReqProduct,
      };
    }

    //* User:
    if ((user.role = Role.User)) {
      //* check if this user own this requst product:
      if (user.id !== existedReqProduct.user) {
        throw new UnauthorizedException();
      }
      await existedReqProduct.populate({
        path: 'user',
        select: 'name email',
      });

      return {
        status: 200,
        message: 'The Request Product founded successfully',
        data: existedReqProduct,
      };
    }
  }

  async update(id: string, updateReqProductDto: UpdateReqProductDto, user) {
    //* check if the id is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The Id is not valid');
    }

    //* check if the reqProduct is existed:
    const existedReqProduct = await this.reqProductModel
      .findById(id)
      .select('-__v');
    if (!existedReqProduct) {
      throw new NotFoundException('The Request Product is not found');
    }

    //* check if this user own this requst product:
    if (user.id !== existedReqProduct.user) {
      throw new UnauthorizedException();
    }

    const updatedReqProduct = await this.reqProductModel.findByIdAndUpdate(
      id,
      updateReqProductDto,
      { new: true, fields: '-__v' },
    );

    await updatedReqProduct!.populate({
      path: 'user',
      select: 'name email',
    });
    return {
      status: 200,
      message: 'The Request Product updated successfully',
      data: updatedReqProduct,
    };
  }

  async remove(id: string, user): Promise<void> {
    //* check if the id is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The Id is not valid');
    }

    //* check if the reqProduct is existed:
    const existedReqProduct = await this.reqProductModel
      .findById(id)
      .select('-__v');
    if (!existedReqProduct) {
      throw new NotFoundException('The Request Product is not found');
    }

    //* check if this user own this requst product:
    if (user.id !== existedReqProduct.user) {
      throw new UnauthorizedException();
    }

    await this.reqProductModel.findByIdAndDelete(id);
  }
}
