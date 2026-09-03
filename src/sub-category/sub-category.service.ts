import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import mongoose, { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    //* check if the categoryId is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(createSubCategoryDto.category)) {
      throw new BadRequestException('This Id is not valid id for a category');
    }

    //* check if name already existed:
    const existSubCategory = await this.subCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });

    if (existSubCategory) {
      throw new BadRequestException('The SubCategory already exist :(');
    }

    //* check if the categoryId is exist:
    const existCategory = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );

    if (!existCategory) {
      throw new NotFoundException('The category with this id is not found :(');
    }

    //* create new subCategory:
    const newSubCategory =
      await this.subCategoryModel.create(createSubCategoryDto);

    await newSubCategory.populate('category');

    return {
      status: 201,
      message: 'the subCategory is created successfully :)',
      data: newSubCategory,
    };
  }

  async findAll() {
    const subCategories = await this.subCategoryModel
      .find()
      .populate('category');

    return {
      status: 200,
      message: 'All Sub Categories founded successfully',
      data: subCategories,
      length: subCategories.length,
    };
  }

  async findOne(id: string) {
    //* check if the id is a valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is not a vaild id');
    }

    //* check if the subCategory is existed:
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate('category');
    if (!subCategory) {
      throw new NotFoundException('The sub category is not found');
    }

    return {
      status: 200,
      message: 'The subCategory is founded successfully :)',
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    //* check if the categoryId is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This Id is not valid id for a category');
    }

    //* check if the subCategory is existed:
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new NotFoundException('The subCategory is not founded :(');
    }

    //* If user change the name should check uniqness:
    if (updateSubCategoryDto.name) {
      const existSubCategory = await this.subCategoryModel.findOne({
        name: updateSubCategoryDto.name,
        _id: { $ne: id },
      });

      if (existSubCategory) {
        throw new BadRequestException('This subCategory already existed :(');
      }
    }

    //* If user change the category id should check if this category existed or not:
    if (updateSubCategoryDto.category) {
      if (!mongoose.Types.ObjectId.isValid(updateSubCategoryDto.category)) {
        throw new BadRequestException('Invalid category ID');
      }
      const existCategory = await this.categoryModel.findById(
        updateSubCategoryDto.category,
      );
      if (!existCategory) {
        throw new NotFoundException('This category is not founded');
      }
    }

    const updatedSubCategory = await this.subCategoryModel
      .findByIdAndUpdate(id, updateSubCategoryDto, { new: true })
      .select('-__v')
      .populate('category');

    return {
      status: 200,
      message: 'The subCategory is updated successfuly :)',
      data: updatedSubCategory,
    };
  }

  async remove(id: string) {
    //* check if the subCategory is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Make sure this id is a valid id');
    }

    //* check if the subCategory is existed:
    const existSubCategory = await this.subCategoryModel.findById(id);
    if (!existSubCategory) {
      throw new NotFoundException('This subCategory is not founded');
    }

    await this.subCategoryModel.findOneAndDelete({ _id: id });
    return {
      status: 200,
      message: 'Subcategory is deleted Successfully :)',
    };
  }
}
