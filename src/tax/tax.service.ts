import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './tax.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {}
  async create(createTaxDto: CreateTaxDto) {
    //* check if the Tax is already existed:
    const existedTax = await this.taxModel.findOne({ name: CreateTaxDto.name });
    if (existedTax) {
      throw new BadRequestException('The Tax is already existed');
    }

    //* create new Tax
    const tax = await this.taxModel.create(createTaxDto);
    return {
      status: 201,
      message: 'Tax created successfully',
      data: tax,
    };
  }

  async findAll() {
    const tax = await this.taxModel.find().select('-__v');
    return {
      status: 200,
      message: 'tax is fetched successfully',
      data: tax,
    };
  }

  async findOne(id: string) {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The ID must be valid');
    }

    //* check if the Tax is existed:
    const tax = await this.taxModel.findById(id).select('-__v');
    if (!tax) {
      throw new NotFoundException('The Tax is not found');
    }

    return {
      status: 200,
      message: 'The Tax is founded successfully',
      data: tax,
    };
  }

  async update(id: string, updateTaxDto: UpdateTaxDto) {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The ID must be valid');
    }

    //* check if the Tax is existed:
    const tax = await this.taxModel.findById(id).select('-__v');
    if (!tax) {
      throw new NotFoundException('The Tax is not found');
    }

    //* check the tax name unqiness:
    if (updateTaxDto.name) {
      const existedTax = await this.taxModel.findOne({
        name: updateTaxDto.name,
        _id: { $ne: id },
      });

      if (existedTax) {
        throw new BadRequestException('The Tax is already existed');
      }
    }

    //* update the Tax:
    const updatedTax = await this.taxModel.findByIdAndUpdate(id, updateTaxDto, {
      new: true,
      fields: '-__v',
    });
    return {
      status: 200,
      message: 'The Tax is updated successfully',
      data: updatedTax,
    };
  }

  async remove(id: string): Promise<void> {
    //* check if the id is valid id:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The ID must be valid');
    }

    //* check if the Tax is existed:
    const tax = await this.taxModel.findById(id).select('-__v');
    if (!tax) {
      throw new NotFoundException('The Tax is not found');
    }

    //* Delete Tax
    await this.taxModel.findByIdAndDelete(id);
  }
}
