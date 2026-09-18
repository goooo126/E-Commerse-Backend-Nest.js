import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Connection, Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  async create(createReviewDto: CreateReviewDto, user: any) {
    //* Check if the product exists
    //* Check if this user already reviewed the product
    const [existedProduct, existedReview] = await Promise.all([
      this.productModel.findById(createReviewDto.product),
      this.reviewModel.findOne({
        user: user.id,
        product: createReviewDto.product,
      }),
    ]);

    if (!existedProduct) {
      throw new NotFoundException('The Product does not exist');
    }

    if (existedReview) {
      throw new BadRequestException(
        'This user already reviewed the product before',
      );
    }

    const rateingAverage =
      (existedProduct.rateingAverage + createReviewDto.rating) /
      (existedProduct.rateingCount + 1);

    // Start transaction
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      // Create Review
      const [newReview] = await this.reviewModel.create(
        [
          {
            ...createReviewDto,
            user: user.id,
          },
        ],
        { session },
      );

      // Update Product
      await this.productModel.findByIdAndUpdate(
        createReviewDto.product,
        {
          rateingAverage: rateingAverage,
          rateingCount: existedProduct.rateingCount + 1,
        },
        {
          session,
          new: true,
        },
      );

      // Commit
      await session.commitTransaction();

      return newReview;
    } catch (error) {
      // Rollback
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  findAll(user: any) {
    return `This action returns all review`;
  }

  findOne(id: string, user: any) {
    return `This action returns a #${id} review`;
  }

  update(id: string, updateReviewDto: UpdateReviewDto, user: any) {
    return `This action updates a #${id} review`;
  }

  remove(id: string, user: any) {
    return `This action removes a #${id} review`;
  }
}
