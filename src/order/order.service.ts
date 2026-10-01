import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    user: { id: string; role: string },
  ) {
    return 'This action adds a new order';
  }

  async findAll(user: { id: string; role: string }) {
    return `This action returns all order`;
  }

  async findOne(id: string, user: { id: string; role: string }) {
    return `This action returns a #${id} order`;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: { id: string; role: string },
  ) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string, user: { id: string; role: string }) {
    return `This action removes a #${id} order`;
  }
}
