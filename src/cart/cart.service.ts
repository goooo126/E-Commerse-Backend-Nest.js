import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly carModel: Model<Cart>) {}

  create(createCartDto: CreateCartDto, user: { id: string; role: string }) {
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: string, user: { id: string; role: string }) {
    return `This action returns a #${id} cart`;
  }

  update(
    id: string,
    updateCartDto: UpdateCartDto,
    user: { id: string; role: string },
  ) {
    return `This action updates a #${id} cart`;
  }

  remove(id: string,user: { id: string; role: string }) {
    return `This action removes a #${id} cart`;
  }
}
