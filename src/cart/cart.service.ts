import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import mongoose, { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { CreateBrandDto } from 'src/brand/dto/create-brand.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly carModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(
    createCartDto: CreateCartDto,
    user: { id: string; role: string },
  ) {
    //* check if user has already cart:
    const cart = await this.carModel.findOne({ user: user.id }).select('-__v');

    if (cart) {
      //* check if the product is exsisted and it's quantity large or equal to 1:
      const product = await this.productModel.findById(createCartDto.product);
      if (!product || product.quantity < createCartDto.quantity) {
        throw new NotFoundException(
          'The product is not found or the requested quantity is unavailable',
        );
      }

      //* check if the product in the cart or not:
      const result = cart.cartItems
        .map((item, index) => ({ item, index }))
        .find(
          ({ item }) =>
            item.product.toString() === createCartDto.product.toString(),
        );

      const existProduct = result?.item;
      const index = result?.index;

      if (existProduct) {
        cart.cartItems[index!].quantity += createCartDto.quantity;
      } else {
        cart.cartItems.push({
          product: createCartDto.product,
          quantity: createCartDto.quantity,
          color: createCartDto.color,
        });
      }

      cart.totalPrice =
        cart.totalPrice + product.price * createCartDto.quantity;
      cart.totalPriceAfterDiscount =
        cart.totalPriceAfterDiscount + product.price * createCartDto.quantity;

      const updatedCart = await cart.save();

      return {
        status: 200,
        message: 'The product added successfully',
        data: updatedCart,
      };
    } else {
      //* check if the product is exsisted and it's quantity large or equal to 1:
      const product = await this.productModel.findById(createCartDto.product);
      if (!product || product.quantity < createCartDto.quantity) {
        throw new NotFoundException(
          'The product is not found or the requested quantity is unavailable',
        );
      }

      const quantity = createCartDto.quantity || 1;
      const totalPrice = product.price * quantity;

      //* create new cart:
      const newCart = await this.carModel.create({
        cartItems: [{ ...createCartDto }],
        totalPrice: totalPrice,
        totalPriceAfterDiscount: totalPrice,
        user: user.id,
      });

      return {
        status: 201,
        message: 'The Product added successfully',
        data: newCart,
      };
    }
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

  remove(id: string, user: { id: string; role: string }) {
    return `This action removes a #${id} cart`;
  }
}
