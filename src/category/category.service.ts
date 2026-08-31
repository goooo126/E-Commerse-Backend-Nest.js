import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import mongoose, { Model } from 'mongoose';

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

  async findOne(id: string) {
    //* check the id is valid:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Is ${id} a valid ObjectId?`, 400);
    }

    //* check if the category is founed or not:
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException('Category is not Found :)', 404);
    }

    return {
      status: 200,
      message: 'The Category is founed Successfully',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    //* check if the id is a valid ID:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Is ${id} a valid ObjectId`, 400);
    }

    //* check if the category is founded or not:
    const existedCategory = await this.categoryModel.findById(id);
    if (!existedCategory) {
      throw new HttpException('Category is not Found', 404);
    }

    const newCategory = await this.categoryModel.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
      { new: true },
    );
    return {
      status: 200,
      message: "The Category is updated successfully",
      data: newCategory,
    };
  }

  async remove(id: string) {
    //* check if the id is valid: 
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new HttpException(`Is ${id} is a valid ObjectId`,400);
    }

    //* check if the category is exist:
    const existedCategory = await this.categoryModel.findById(id);
    if(!existedCategory){
      throw new HttpException('category is not founded',404);
    }

    //TODO: delete all subCategory related to this:

    await this.categoryModel.findOneAndDelete({_id:id});
    return {
      status:200,
      message: 'the category is deleted successfully :)',
    };
  }
}
