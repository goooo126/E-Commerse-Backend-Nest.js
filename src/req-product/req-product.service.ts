import { Injectable } from '@nestjs/common';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReqProduct } from './req-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReqProductService {
  constructor(
    @InjectModel(ReqProduct.name) private reqProductModel: Model<ReqProduct>,
  ) {}
  create(createReqProductDto: CreateReqProductDto) {
    return 'This action adds a new reqProduct';
  }

  findAll() {
    return `This action returns all reqProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reqProduct`;
  }

  update(id: number, updateReqProductDto: UpdateReqProductDto) {
    return `This action updates a #${id} reqProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} reqProduct`;
  }
}
