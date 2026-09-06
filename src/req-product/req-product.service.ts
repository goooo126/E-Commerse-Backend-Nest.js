import { Injectable } from '@nestjs/common';
import { CreateReqProductDto } from './dto/create-req-product.dto';
import { UpdateReqProductDto } from './dto/update-req-product.dto';

@Injectable()
export class ReqProductService {
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
