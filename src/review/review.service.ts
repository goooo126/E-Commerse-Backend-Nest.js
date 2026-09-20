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

      //* Update Product
      const result = await this.reviewModel.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(createReviewDto.product),
          },
        },
        {
          $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            ratingsCount: { $sum: 1 },
          },
        },
      ]);

      const rating = result[0] || {
        averageRating: 0,
        ratingsCount: 0,
      };

      await this.productModel.findByIdAndUpdate(createReviewDto.product, {
        rateingAverage: rating.averageRating,
        rateingCount: rating.ratingsCount,
      });

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
    //* 1. Check if the id is a valid MongoId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The id is invalid');
    }

    //* 2. Start session
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      //* 3. Check if the review exists
      const existedReview = await this.reviewModel
        .findById(id)
        .session(session);

      if (!existedReview) {
        throw new NotFoundException('The review is not found');
      }

      //* 4. Check if the user owns the review
      if (existedReview.user.toString() !== user.id) {
        throw new UnauthorizedException('This user does not own the review');
      }

      //* 5. Get the product
      const existedProduct = await this.productModel
        .findById(existedReview.product)
        .session(session);

      if (!existedProduct) {
        throw new NotFoundException('The product is not found');
      }

      //* 6. Update review
      const updatedReview = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
        {
          new: true,
          projection: '-__v',
          session,
          runValidators: true,
        },
      );

      if (!updatedReview) {
        throw new NotFoundException('The review is not found');
      }

      //* 7. Recalculate product rating
      if (updateReviewDto.rating !== undefined) {
        const result = await this.reviewModel
          .aggregate([
            {
              $match: {
                product: existedReview.product,
              },
            },
            {
              $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                ratingsCount: { $sum: 1 },
              },
            },
          ])
          .session(session);

        const rating = result[0] || {
          averageRating: 0,
          ratingsCount: 0,
        };

        //* 8. Update product rating
        await this.productModel.findByIdAndUpdate(
          existedReview.product,
          {
            averageRating: rating.averageRating,
            ratingsCount: rating.ratingsCount,
          },
          {
            session,
            runValidators: true,
          },
        );
      }

      //* 9. Commit transaction
      await session.commitTransaction();

      return {
        status: 200,
        message: 'The review updated successfully',
        data: updatedReview,
      };
    } catch (error) {
      //* Abort transaction if an error occurs
      await session.abortTransaction();
      throw error;
    } finally {
      //* End session
      await session.endSession();
    }
  }

  remove(id: string, user: any) {
    return `This action removes a #${id} review`;
  }
}
