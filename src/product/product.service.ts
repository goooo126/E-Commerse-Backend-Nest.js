import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { GetProductsDto } from './dto/get-products.dto';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';
import { Brand } from 'src/brand/brand.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
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
          ? this.subCategoryModel.findById(createProductDto.subCategory)
          : null,

        createProductDto.brand
          ? this.brandModel.findById(createProductDto.brand)
          : null,
      ]);

    if (!existedCategory) {
      throw new NotFoundException('The category was not found');
    }

    if (createProductDto.subCategory && !existedSubCategory) {
      throw new NotFoundException('The subCategory was not found');
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
    return `This action returns all product`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
