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

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    //* check if the categoryId is a valid Id:
    if (!mongoose.Types.ObjectId.isValid(createSubCategoryDto.category)) {
      throw new BadRequestException('This Id is not valid id for a category');
    }

    //* check if name already existed:
    const existSubCategory = await this.subCategoryModel.find({
      name: createSubCategoryDto.name,
    });

    if (existSubCategory) {
      throw new BadRequestException('The SubCategory already exist :(');
    }

    //* check if the categoryId is exist:
    const existCategory = await this.subCategoryModel.findById(
      createSubCategoryDto.category,
    );

    if (!existCategory) {
      throw new NotFoundException('The category with this id is not found :(');
    }

    //* create new subCategory:
    const newSubCategory =
      await this.subCategoryModel.create(createSubCategoryDto);
    return {
      status: 201,
      message: 'the subCategory is created successfully :)',
      data: newSubCategory,
    };
  }

  findAll() {
    return `This action returns all subCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
