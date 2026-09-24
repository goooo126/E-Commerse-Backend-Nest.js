import {
  BadRequestException,
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
import { GetCartDto } from './dto/get-cart.dto';
import { SortOrder } from 'mongoose';
import { Role } from 'src/user/enums/roles.enum';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { Coupon } from 'src/coupon/coupon.schema';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly carModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
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

  async findAll(query: GetCartDto, user: { id: string; role: string }) {
    const {
      limit = 10,
      skip = 0,
      maxTotalPrice,
      minTotalPrice,
      order = 'asc',
    } = query;

    //* admin
    if (user.role === Role.Admin) {
      const filter: any = {};

      if (minTotalPrice !== undefined || maxTotalPrice !== undefined) {
        filter.totalPrice = {};

        if (minTotalPrice !== undefined) {
          filter.totalPrice.$gte = minTotalPrice;
        }

        if (maxTotalPrice !== undefined) {
          filter.totalPrice.$lte = maxTotalPrice;
        }
      }

      const sortOptions: Record<string, SortOrder> = {
        ['totalPrice']: order === 'asc' ? 1 : -1,
      };

      const [carts, total] = await Promise.all([
        this.carModel
          .find(filter)
          .select('-__v')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .populate('user', 'name email'),
        this.carModel.countDocuments(filter),
      ]);
      return {
        status: 200,
        message: 'carts fetched successfully',
        data: {
          carts,
          pagination: {
            total,
            limit,
            skip,
            returned: carts.length,
          },
        },
      };
    }

    //* User:
    if (user.role === Role.User) {
      const cart = await this.carModel
        .findOne({ user: user.id })
        .select('-__v');

      if (!cart) {
        throw new NotFoundException('The user has no cart');
      }

      return {
        status: 200,
        message: 'Cart fetched successfully',
        data: cart,
      };
    }

    if (user.role !== Role.Admin && user.role !== Role.User) {
      throw new ForbiddenException('Invalid user role');
    }
  }

  async findOne(id: string) {
    //* check if the id is valid:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The is Invalid');
    }

    //* check if cart is existed:
    const cart = await this.carModel
      .findById(id)
      .select('-__v')
      .populate('cartItems.product', 'title imageCover price')
      .populate('user', 'name');
    if (!cart) {
      throw new NotFoundException('The cart is not found');
    }

    return {
      status: 200,
      message: 'The cart is founed',
      data: cart,
    };
  }

  async update(
    productId: string,
    updateCartDto: UpdateCartDto,
    user: { id: string; role: string },
  ) {
    //* check if the user has cart:
    const cart = await this.carModel.findOne({ user: user.id });
    if (!cart) {
      throw new NotFoundException('The cart is not found');
    }

    //* check if the product is exsisted and it's quantity large or equal to 1:
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('The product is not found');
    }

    //* check if the product in the cart or not:
    const result = cart.cartItems
      .map((item, index) => ({ item, index }))
      .find(({ item }) => item.product.toString() === productId.toString());

    const existProduct = result?.item;
    const index = result?.index;

    if (!existProduct) {
      throw new NotFoundException('The product is not in the cart');
    }

    //* update quantity
    if (updateCartDto.quantity !== undefined) {
      if (updateCartDto.quantity > product.quantity) {
        throw new BadRequestException(
          `Only ${product.quantity} items are available`,
        );
      }

      cart.cartItems[index!].quantity = updateCartDto.quantity;

      //* recalculate total price
      let totalPrice = 0;

      for (const item of cart.cartItems) {
        const product = await this.productModel.findById(item.product);

        if (product) {
          totalPrice += product.price * item.quantity;
        }
      }

      cart.totalPrice = totalPrice;
      cart.totalPriceAfterDiscount = totalPrice;
    }

    //* update color
    if (updateCartDto.color !== undefined) {
      cart.cartItems[index!].color = updateCartDto.color;
    }

    const newCart = await cart.save();

    return {
      status: 200,
      message: 'Update the cart successfully',
      data: newCart,
    };
  }

  async removeCart(user: { id: string; role: string }): Promise<void> {
    const cart = await this.carModel.findOne({ user: user.id });
    if (!cart) {
      throw new NotFoundException('The cart is not found');
    }

    await this.carModel.findByIdAndDelete(cart._id);
  }

  async removeProduct(productId: string, user: { id: string; role: string }) {
    //* check if user has a cart:
    const cart = await this.carModel.findOne({ user: user.id });
    if (!cart) {
      throw new NotFoundException("The user doesn't have cart");
    }

    //* check if the product in the cart or not:
    const result = cart.cartItems
      .map((item, index) => ({ item, index }))
      .find(({ item }) => item.product.toString() === productId.toString());

    const existProduct = result?.item;
    const index = result?.index;

    if (!existProduct) {
      throw new NotFoundException('The product is not in the cart');
    }

    cart.cartItems.splice(index!, 1);
    //* recalculate total price
    let totalPrice = 0;

    for (const item of cart.cartItems) {
      const product = await this.productModel.findById(item.product);

      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }

    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = totalPrice;

    const newCart = await cart.save();

    return {
      status: 200,
      message: 'The Product is delete successfully',
      data: newCart,
    };
  }

  async apllyCoupon(
    applyCoupon: ApplyCouponDto,
    user: { id: string; role: string },
  ) {
    //* check if the user has cart:
    const cart = await this.carModel.findOne({ user: user.id });
    if (!cart) {
      throw new NotFoundException('The user does not have cart');
    }

    //* Check if a coupon is already applied
    if (cart.coupons?.length > 0) {
      throw new BadRequestException('A coupon is already applied');
    }

    const date = new Date();
    //* chcek if the coupon is existed and not expired:
    const coupon = await this.couponModel.findOne({ name: applyCoupon.name });
    if (!coupon) {
      throw new NotFoundException('The coupon is not existed');
    }

    if (date > coupon.expireDate) {
      throw new BadRequestException('The coupon is expired');
    }

    //* Save coupon information
    cart.coupons = [
      {
        name: coupon.name,
        id: coupon._id.toString(),
      },
    ];

    //* apply the discound:
    const discountPresentage = coupon.discount / 100;
    cart.totalPriceAfterDiscount =
      cart.totalPrice - cart.totalPrice * discountPresentage;

    const newCart = await cart.save();

    return {
      status: 200,
      message: 'the coupon is applied successfully',
      data: newCart,
    };
  }

  async removeCoupon(user: { id: string; role: string }) {
    //* Check if the user has a cart:
    const cart = await this.carModel.findOne({ user: user.id });

    if (!cart) {
      throw new NotFoundException('The user does not have cart');
    }

    //* Check if the cart has a coupon:
    if (!cart.coupons || cart.coupons.length === 0) {
      throw new BadRequestException('No coupon applied to the cart');
    }

    //* Remove the applied coupon:
    cart.coupons = [];

    //* Reset the total price after discount:
    cart.totalPriceAfterDiscount = cart.totalPrice;

    //* Save the updated cart:
    const newCart = await cart.save();

    return {
      status: 200,
      message: 'Coupon removed successfully',
      data: newCart,
    };
  }
}
