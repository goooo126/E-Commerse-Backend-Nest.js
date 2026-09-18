import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';
import { GetReviewDto } from './dto/get-review.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';

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

      return {
        status: 201,
        message: 'The review is created successfuly',
        data: newReview,
      };
    } catch (error) {
      // Rollback
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAll(query: GetReviewDto, user: any) {
    const { limit = 10, skip = 0 } = query;

    if (user.role === Role.Admin) {
      const [reviews, total] = await Promise.all([
        this.reviewModel
          .find()
          .skip(skip)
          .limit(limit)
          .select('-__v')
          .populate('user', 'name'),
        this.reviewModel.countDocuments(),
      ]);

      return {
        status: 200,
        message: 'get all reviews',
        data: reviews,
        pagination: {
          total,
          limit,
          skip,
          returned: reviews.length,
        },
      };
    }

    if (user.role === Role.User) {
      const [reviews, total] = await Promise.all([
        this.reviewModel
          .find()
          .where({ user: user.id })
          .skip(skip)
          .limit(limit)
          .select('-__v')
          .populate('user', 'name'),
        this.reviewModel.countDocuments(),
      ]);

      return {
        status: 200,
        message: 'get all reviews owned by the user',
        data: reviews,
        pagination: {
          total,
          limit,
          skip,
          returned: reviews.length,
        },
      };
    }
  }

  async findOne(id: string, user: any) {
    //* check if the id is a mongoId:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The Id is invalid');
    }

    //* check if the review is existed:
    const existReview = await this.reviewModel.findById(id).select('-__v');
    if (!existReview) {
      throw new NotFoundException('The review is not exsisted');
    }

    //* Admin:
    if (user.role === Role.Admin) {
      return {
        status: 200,
        message: 'The review founded',
        data: existReview,
      };
    }

    //* user:
    if (user.role === Role.User) {
      if (existReview.user != user.id) {
        throw new UnauthorizedException(
          'This Review is not belong to this user',
        );
      }

      return {
        status: 200,
        message: 'The review founded',
        data: existReview,
      };
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: any) {
    //* check if the id is mongoId:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The id is Invalid');
    }

    //* check if the review is alreay existed:
    const existedReview = await this.reviewModel.findById(id);
    if (!existedReview) {
      throw new NotFoundException('The review is not found');
    }

    //* check if the user own the review:
    if (existedReview.user !== user.id) {
      throw new UnauthorizedException('This user does not own the review');
    }

    //* get the product:
    const existedProduct = await this.productModel.findById(
      existedReview.product,
    );
    if (!existedProduct) {
      throw new NotFoundException('The product is not found');
    }

    var rateingAverage = existedProduct.rateingAverage;
    //* if user update the rating
    if (updateReviewDto.rating) {
      rateingAverage =
        (existedProduct.rateingAverage + updateReviewDto.rating) /
        existedProduct.rateingCount;
    }

    //* start session
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      //* update Review
      const updatedReview = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
        { new: true, fields: '-__v', session },
      );

      //* update the product:
      await this.productModel.findByIdAndUpdate(
        updateReviewDto.product,
        {
          rateingAverage: rateingAverage,
        },
        { session, new: true },
      );

      await session.commitTransaction();

      return {
        status: 200,
        message: 'The review updated sucessfully',
        data: updatedReview,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  remove(id: string, user: any) {
    return `This action removes a #${id} review`;
  }
}
