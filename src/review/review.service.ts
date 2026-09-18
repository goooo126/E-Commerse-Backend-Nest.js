import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  create(createReviewDto: CreateReviewDto, user: any) {
    return 'This action adds a new review';
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
