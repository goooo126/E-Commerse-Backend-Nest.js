import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { GetBrandsDto } from './dto/get-brands-dto';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(createBrandDto: CreateBrandDto) {
    //* check if the name is already existed:
    const existBrand = await this.brandModel.findOne({
      name: createBrandDto.name,
    });
    if (existBrand) {
      throw new BadRequestException('The brand already existed');
    }

    //TODO: if the image added I will upload it as soon as:

    const newBrand = (await this.brandModel.create(createBrandDto)).isSelected(
      '-__V',
    );
    return {
      status: 200,
      message: 'The Brand created Successfully :)',
      data: newBrand,
    };
  }

  async findAll(query: GetBrandsDto) {
    const { limit = 10, skip = 0 } = query;

    const [brands, total] = await Promise.all([
      this.brandModel.find().select('-__v').skip(skip).limit(limit),

      this.brandModel.countDocuments(),
    ]);

    return {
      status: 200,
      message: 'Brands fetched successfully',
      data: {
        brands,
        pagination: {
          total,
          limit,
          skip,
          returned: brands.length,
        },
      },
    };
  }

  async findOne(id: string) {
    //* check if the id is valid ID:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is not valid ID');
    }

    //* check if the Brand is exsited:
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('The brand is not existed');
    }

    return {
      status: 200,
      message: 'The Brand founded successfully',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    //* check if the id is valid ID:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is not valid ID');
    }

    //* check if the Brand is exsited:
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('The brand is not existed');
    }

    //* if the name updated check the name uniqness
    if (updateBrandDto.name) {
      const existedBrand = await this.brandModel.findOne({
        name: updateBrandDto.name,
        _id: { $ne: id },
      });

      if (existedBrand) {
        throw new BadRequestException('The Brand is already existed');
      }
    }

    //TODO: If the images is updated

    //* update the brand:
    const updatedBrand = await this.brandModel
      .findOneAndUpdate({ _id: id }, updateBrandDto, { new: true })
      .select('-__V');
    return {
      status: 200,
      message: 'The brand is updated successfully',
      data: updatedBrand,
    };
  }

  async remove(id: string) {
    //* check if the id is valid ID:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('This is not valid ID');
    }

    //* check if the Brand is exsited:
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('The brand is not existed');
    }

    //* delete the brand:
    await this.brandModel.findByIdAndDelete(id);

    return {
      status: 200,
      message: 'The Brand is delete successfully :(',
    };
  }
}
