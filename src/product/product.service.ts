import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import mongoose, { Connection, connection, Model, SortOrder } from 'mongoose';
import { GetProductsDto } from './dto/get-products.dto';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';
import { Brand } from 'src/brand/brand.schema';
import { Review } from 'src/review/review.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createProductDto: CreateProductDto) {
    //* check if the product is already existed:
    const existedProduct = await this.productModel.findOne({
      title: createProductDto.title,
    });
    if (existedProduct) {
      throw new BadRequestException('This Product is already existed');
    }

    const [existedCategory, existedSubCategory, existedBrand] =
      await Promise.all([
        createProductDto.category
          ? this.categoryModel.findById(createProductDto.category)
          : null,

        createProductDto.subCategory
          ? this.subCategoryModel.findOne({
              _id: createProductDto.subCategory,
              category: createProductDto.category,
            })
          : null,

        createProductDto.brand
          ? this.brandModel.findById(createProductDto.brand)
          : null,
      ]);

    if (!existedCategory) {
      throw new NotFoundException('The category was not found');
    }

    if (createProductDto.subCategory && !existedSubCategory) {
      throw new NotFoundException(
        'The subCategory was not found or not belong to the category',
      );
    }

    if (createProductDto.brand && !existedBrand) {
      throw new NotFoundException('The brand was not found');
    }

    //* create new product:
    const newProduct = await this.productModel.create(createProductDto);

    return {
      stauts: 201,
      message: 'The product is created successfully',
      data: newProduct,
    };
  }

  async findAll(query: GetProductsDto) {
    const {
      limit = 10,
      skip = 0,
      title,
      category,
      subCategory,
      brand,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'asc',
    } = query;

    const filter: any = {};

    if (title) {
      filter.title = {
        $regex: title,
        $options: 'i',
      };
    }

    if (category) {
      filter.category = category;
    }
    if (subCategory) {
      filter.subCategory = subCategory;
    }
    if (brand) {
      filter.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    const sortOptions: Record<string, SortOrder> = {
      [sort]: order === 'asc' ? 1 : -1,
    };

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .select('-__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate(['category', 'subCategory', 'brand'], ['name']),
      this.productModel.countDocuments(filter),
    ]);
    return {
      status: 200,
      message: 'products fetched successfully',
      data: {
        products,
        pagination: {
          total,
          limit,
          skip,
          returned: products.length,
        },
      },
    };
  }

  async findOne(id: string) {
    //* check if the id is a valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This id must be valid id');
    }

    //* check if the product is existed:
    const product = await this.productModel
      .findById(id)
      .select('-__v')
      .populate(['category', 'subCategory', 'brand'], ['name']);

    if (!product) {
      throw new NotFoundException('The product is not founded');
    }
    return {
      stauts: 200,
      message: 'The product founded successfully',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //* check if the id is a valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The Id must be valid id');
    }

    //* check if the product is exsited:
    const existedProduct = await this.productModel.findById(id);
    if (!existedProduct) {
      throw new NotFoundException('The product is not found');
    }

    //* check if there is update in product title:
    if (updateProductDto.title) {
      const product = await this.productModel.findOne({
        title: updateProductDto.title,
        _id: { $ne: id },
      });

      if (product) {
        throw new BadRequestException('The product is already exsited');
      }
    }

    //* check if there is update in (category or subcategory or brand):
    const categoryId = updateProductDto.category ?? existedProduct.category;

    //* If category changes, require a subCategory
    if (
      updateProductDto.category &&
      updateProductDto.category.toString() !==
        existedProduct.category.toString() &&
      !updateProductDto.subCategory
    ) {
      throw new BadRequestException(
        'SubCategory is required when changing the category',
      );
    }

    //* Validate category + subCategory relationship
    const [existedCategory, existedSubCategory, existedBrand] =
      await Promise.all([
        updateProductDto.category
          ? this.categoryModel.findById(updateProductDto.category)
          : null,

        updateProductDto.subCategory
          ? this.subCategoryModel.findOne({
              _id: updateProductDto.subCategory,
              category: categoryId,
            })
          : null,
        updateProductDto.brand
          ? this.brandModel.findById(updateProductDto.brand)
          : null,
      ]);

    if (updateProductDto.category && !existedCategory) {
      throw new NotFoundException('The category was not found');
    }

    if (updateProductDto.subCategory && !existedSubCategory) {
      throw new NotFoundException(
        'The subCategory was not found or does not belong to the category',
      );
    }

    if (updateProductDto.brand && !existedBrand) {
      throw new NotFoundException('The brand was not found');
    }

    //* Update the product
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true, fields: '-__v' })
      .populate(['category', 'subCategory', 'brand'], ['name']);
    return {
      stauts: 200,
      message: 'Product updated',
      data: updatedProduct,
    };
  }

  async remove(id: string): Promise<void> {
    //* check if the id is a valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This id must be valid id');
    }

    //* check if the product is existed:
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('The product is not founded');
    }

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      //* Delete product
      await this.productModel.findByIdAndDelete(id, {
        session,
      });

      //*  Delete all reviews related to this product
      await this.reviewModel.deleteMany({ product: id }, { session });

      await session.commitTransaction();
    } catch (error) {
      session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findReviewsForProducut(id: string, query: GetProductsDto) {
    const { limit = 10, skip = 0 } = query;
    //* check if the id is valid:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The id is invalid');
    }

    //* check if the product is existed:
    const existedProduct = await this.productModel.findById(id);
    if (!existedProduct) {
      throw new NotFoundException('The product is not found');
    }

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ product: id })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      this.reviewModel.countDocuments({ product: id }),
    ]);
    return {
      status: 200,
      message: 'reviews fetched successfully',
      data: {
        reviews,
        pagination: {
          total,
          limit,
          skip,
          returned: reviews.length,
        },
      },
    };
  }
}
