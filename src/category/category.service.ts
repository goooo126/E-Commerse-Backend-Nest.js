import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    //* check if the category is exist or not
    const existedCategory = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (existedCategory) {
      throw new HttpException('The category already exist :(', 400);
    }

    //* upload image to the images service and get the url
    if (createCategoryDto.image) {
    }

    //* create the category and add it to database:
    const newCategory = await this.categoryModel.create(createCategoryDto);

    return {
      status: 201,
      message: 'The category is created successfully :)',
      data: newCategory,
    };
  }

  async findAll() {
    const categories = await this.categoryModel.find();

    if (!categories) {
      throw new HttpException('Something went wrong', 400);
    }

    return {
      status: 200,
      message: 'Get All Categories successfully :)',
      data: categories,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
